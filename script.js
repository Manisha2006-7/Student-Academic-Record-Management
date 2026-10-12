const STORAGE_KEY = "campusDeskStudents_v1";
const sampleStudents = [
  { recordId: "r1", studentId: "CSE2026001", name: "Aarav Sharma", email: "aarav@example.com", course: "BE Computer Science", semester: 7, marks: 91 },
  { recordId: "r2", studentId: "CSE2026002", name: "Diya Nair", email: "diya@example.com", course: "BE Computer Science", semester: 7, marks: 84 },
  { recordId: "r3", studentId: "ECE2026001", name: "Kabir Rao", email: "kabir@example.com", course: "BE Electronics", semester: 5, marks: 76 },
  { recordId: "r4", studentId: "AIML2026001", name: "Meera Iyer", email: "meera@example.com", course: "BE Artificial Intelligence", semester: 6, marks: 96 },
  { recordId: "r5", studentId: "ISE2026001", name: "Ishaan Patel", email: "ishaan@example.com", course: "BE Information Science", semester: 4, marks: 63 }
];

const $ = (selector) => document.querySelector(selector);
const dialog = $("#studentDialog");
const form = $("#studentForm");
let students = loadStudents();

function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? [...sampleStudents] : JSON.parse(saved);
  } catch (error) {
    console.error("Could not read saved student data:", error);
    return [...sampleStudents];
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function gradeFor(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  if (marks >= 50) return "D";
  return "F";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

function filteredStudents() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const course = $("#courseFilter").value;
  return students.filter(student => {
    const searchable = [student.name, student.studentId, student.email, student.course].join(" ").toLowerCase();
    return searchable.includes(query) && (!course || student.course === course);
  });
}

function renderCourseFilter() {
  const select = $("#courseFilter");
  const selected = select.value;
  const courses = [...new Set(students.map(student => student.course))].sort();
  select.innerHTML = '<option value="">All courses</option>' + courses.map(course =>
    `<option value="${escapeHTML(course)}">${escapeHTML(course)}</option>`).join("");
  if (courses.includes(selected)) select.value = selected;
}

function renderTable() {
  const visible = filteredStudents();
  $("#studentTableBody").innerHTML = visible.map(student => {
    const marks = Number(student.marks);
    const grade = gradeFor(marks);
    const gradeClass = marks < 60 ? "low" : marks < 80 ? "mid" : "";
    return `<tr>
      <td><div class="student-cell"><div class="student-avatar">${escapeHTML(initials(student.name))}</div><div><div class="student-name">${escapeHTML(student.name)}</div><div class="student-email">${escapeHTML(student.email)}</div></div></div></td>
      <td class="id-text">${escapeHTML(student.studentId)}</td>
      <td>${escapeHTML(student.course)}</td>
      <td>${escapeHTML(student.semester)}</td>
      <td><strong>${marks.toFixed(1)}%</strong></td>
      <td><span class="grade-pill ${gradeClass}">${grade}</span></td>
      <td><div class="actions"><button class="action-btn" data-action="edit" data-id="${escapeHTML(student.recordId)}">Edit</button><button class="action-btn" data-action="delete" data-id="${escapeHTML(student.recordId)}">Delete</button></div></td>
    </tr>`;
  }).join("");
  $("#emptyState").hidden = visible.length !== 0;
  $("#recordCount").textContent = `${visible.length} of ${students.length} record${students.length === 1 ? "" : "s"}`;
}

function renderDashboard() {
  $("#totalStudents").textContent = students.length;
  $("#totalCourses").textContent = new Set(students.map(student => student.course)).size;
  const average = students.length ? students.reduce((sum, student) => sum + Number(student.marks), 0) / students.length : null;
  $("#averageMarks").textContent = average === null ? "—" : `${average.toFixed(1)}%`;
  $("#topPerformers").textContent = students.filter(student => Number(student.marks) >= 85).length;

  const bands = [
    { label: "A+ (90–100)", test: marks => marks >= 90 },
    { label: "A (80–89)", test: marks => marks >= 80 && marks < 90 },
    { label: "B (70–79)", test: marks => marks >= 70 && marks < 80 },
    { label: "C (60–69)", test: marks => marks >= 60 && marks < 70 },
    { label: "Below 60", test: marks => marks < 60 }
  ];
  $("#gradeDistribution").innerHTML = bands.map(band => {
    const count = students.filter(student => band.test(Number(student.marks))).length;
    const percent = students.length ? Math.round(count / students.length * 100) : 0;
    return `<div class="grade-row"><span>${band.label}</span><div class="bar-track"><div class="bar-fill" style="width:${percent}%"></div></div><strong>${count}</strong></div>`;
  }).join("");
}

function render() {
  renderCourseFilter();
  renderTable();
  renderDashboard();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function openAddDialog() {
  form.reset();
  $("#studentRecordId").value = "";
  $("#dialogTitle").textContent = "Add student";
  $("#formError").textContent = "";
  dialog.showModal();
}

function openEditDialog(recordId) {
  const student = students.find(item => item.recordId === recordId);
  if (!student) return;
  $("#studentRecordId").value = student.recordId;
  $("#studentName").value = student.name;
  $("#studentId").value = student.studentId;
  $("#studentEmail").value = student.email;
  $("#studentCourse").value = student.course;
  $("#studentSemester").value = student.semester;
  $("#studentMarks").value = student.marks;
  $("#dialogTitle").textContent = "Edit student";
  $("#formError").textContent = "";
  dialog.showModal();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const recordId = $("#studentRecordId").value;
  const student = {
    recordId: recordId || `r${Date.now()}`,
    name: $("#studentName").value.trim(),
    studentId: $("#studentId").value.trim().toUpperCase(),
    email: $("#studentEmail").value.trim(),
    course: $("#studentCourse").value.trim(),
    semester: Number($("#studentSemester").value),
    marks: Number($("#studentMarks").value)
  };

  if (!student.name || !student.studentId || !student.email || !student.course) {
    $("#formError").textContent = "Please complete all fields.";
    return;
  }
  if (!Number.isFinite(student.marks) || student.marks < 0 || student.marks > 100) {
    $("#formError").textContent = "Marks must be between 0 and 100.";
    return;
  }
  const duplicate = students.some(item => item.studentId.toLowerCase() === student.studentId.toLowerCase() && item.recordId !== recordId);
  if (duplicate) {
    $("#formError").textContent = "That student ID already exists. Use a unique ID.";
    return;
  }

  if (recordId) {
    students = students.map(item => item.recordId === recordId ? student : item);
  } else {
    students.unshift(student);
  }
  saveStudents();
  render();
  dialog.close();
  showToast(recordId ? "Student record updated." : "Student added successfully.");
});

$("#studentTableBody").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "edit") openEditDialog(id);
  if (action === "delete") {
    const student = students.find(item => item.recordId === id);
    if (student && confirm(`Delete the record for ${student.name}?`)) {
      students = students.filter(item => item.recordId !== id);
      saveStudents();
      render();
      showToast("Student record deleted.");
    }
  }
});

$("#addStudentBtn").addEventListener("click", openAddDialog);
$("#closeDialogBtn").addEventListener("click", () => dialog.close());
$("#cancelBtn").addEventListener("click", () => dialog.close());
$("#searchInput").addEventListener("input", renderTable);
$("#courseFilter").addEventListener("change", renderTable);

$("#exportBtn").addEventListener("click", () => {
  if (!students.length) {
    showToast("There are no records to export.");
    return;
  }
  const headings = ["Student ID", "Full Name", "Email", "Course", "Semester", "Marks (%)", "Grade"];
  const rows = students.map(student => [student.studentId, student.name, student.email, student.course, student.semester, student.marks, gradeFor(Number(student.marks))]);
  const csvCell = value => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [headings, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "student-records.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("CSV export downloaded.");
});

render();
