import accessApi from "@/api/accessApi";
export async function registerService(formData) {
  const { data } = await accessApi.post("/auth/register", {
    ...formData,
    role: "user",
  });
  return data;
}
export async function loginService(formData) {
  const { data } = await accessApi.post("/auth/login", formData);
  return data;
}
export async function checkAuth() {
  const { data } = await accessApi.get("/auth/check-auth");
  return data;
}
export async function mediaUpload(formData, onProgressCallback) {
  // const { data } = await accessApi.post("/media/upload", formData);
  // return data;

  const { data } = await accessApi.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgressCallback(percentCompleted);
    },
  });
  return data;
}
export async function bulkMediaUpload(formData, onProgressCallback) {
  const { data } = await accessApi.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgressCallback(percentCompleted);
    },
  });
  return data;
}
export async function mediaDeleteVideo(id) {
  const { data } = await accessApi.delete(`/media/delete/${id}`);
  return data;
}

export async function fetchCourseList() {
  const { data } = await accessApi.get(`/admin/course/get`);
  return data;
}
export async function addNewCourse(formData) {
  const { data } = await accessApi.post(`/admin/course/add`, formData);
  return data;
}
export async function courseDetailsById(id) {
  const { data } = await accessApi.get(`/admin/course/get/details/${id}`);
  return data;
}
export async function checkCoursePurchaseInfo(id, studentId) {
  const { data } = await accessApi.get(`/student/course/purchase-info/${id}/${studentId}`);
  return data;
}
export async function updateCourseById(id, formData) {
  const { data } = await accessApi.put(`/admin/course/update/${id}`, formData);
  return data;
}
export async function fetchStudentCourseList(query) {
  const { data } = await accessApi.get(`/student/course/get?${query}`);
  return data;
}
export async function createPayment(formData) {
  const { data } = await accessApi.post(`/student/order/create`, formData);
  return data;
}
export async function captureAndFinalizePayment(paymentId, PayerId, orderId) {
  const { data } = await accessApi.post(`/student/order/capture`, { paymentId, PayerId, orderId });
  return data;
}
export async function fetchStudentBuyingCourses(studentId) {
  const { data } = await accessApi.get(`/student/courses-buy/get/${studentId}`);
  return data;
}
export async function getStudentCurrentCourseProgress(userId, courseId) {
  const { data } = await accessApi.get(`/student/courses-progress/get/${userId}/${courseId}`);
  return data;
}
export async function markLectureAsView(userId, courseId, lectureId) {
  const { data } = await accessApi.post(`/student/courses-progress/mark-lecture-viewed/`, {userId, courseId, lectureId});
  return data;
}
export async function resetCourseProgress(userId, courseId) {
  const { data } = await accessApi.post(`/student/courses-progress/reset-progress/`, { userId, courseId });
  return data;
}
