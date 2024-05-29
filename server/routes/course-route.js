const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route 正在接收一個request。。。");
  next();
});

//獲得系統中所有的課程
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//用講師課程找出所有課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let foundCourses = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(foundCourses);
});

//利用學生id 找到註冊過的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let foundCourses = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(foundCourses);
});

//學生透過 課程id 註冊課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;

  try {
    let foundCourse = await Course.findOne({ _id }).exec();
    foundCourse.students.push(req.user._id);
    await foundCourse.save();
    return res.send("註冊完成");
  } catch (e) {
    console.log(e);
  }
});

//用課程名稱尋找課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//用課程id尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//新增課程
router.post("/", async (req, res) => {
  //創建課程前 驗證數據符合規範

  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有講師可以發布新課程請透過講師帳號發布。。。");
  }
  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send({
      message: "新課程已經創建成功 ",
      savedCourse,
    });
  } catch (e) {
    return res.status(500).send("無法創建新課程");
  }
});

//更改課程
router.patch("/:_id", async (req, res) => {
  //更改課程前 驗證數據符合規範

  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //確認課程存在
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到此課程 更新失敗");
    }
    //使用者必須是講師 才有權限更新
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "課程已經成功被更新",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有該課程講師有權限編輯此課程資訊");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

//刪除課程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  //確認課程存在
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到該課程 無法進行刪除。。。");
    }

    //必須是該課程講師 才能刪除此課程
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程已經被刪除了");
    } else {
      return res.status(403).send("只有該課程講師 能進行刪除");
    }
  } catch (e) {
    return res.status(500).send("fail");
  }
});

module.exports = router;
