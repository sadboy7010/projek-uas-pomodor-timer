let timer;
let isTimerRunning = false;
let totalStudyTime = 0;
let totalSessions = 0;
let studyTime = 25 * 60; 
let breakTime = 5 * 60; 

// Menambahkan event listener untuk memulai timer
function startPomodoro() {
  if (isTimerRunning) return; 
  
  isTimerRunning = true;
  const studyTimeInput = document.getElementById('studyTime');
  const breakTimeInput = document.getElementById('breakTime');
  studyTime = parseInt(studyTimeInput.value) * 60; 
  breakTime = parseInt(breakTimeInput.value) * 60; 

  startCountdown(studyTime);
}

// Fungsi untuk memulai countdown
function startCountdown(time) {
  let seconds = time;
  const timerDisplay = document.getElementById('timerDisplay');
  const statusMessage = document.getElementById('statusMessage');
  
  timer = setInterval(() => {
    if (seconds <= 0) {
      clearInterval(timer);
      isTimerRunning = false;
      totalSessions++;
      totalStudyTime += studyTime / 60;
      updateStats();
      statusMessage.textContent = "Waktu Belajar Selesai! Saatnya Istirahat!";
      alert("Waktu Belajar Selesai! Saatnya Istirahat.");
      startCountdown(breakTime); 
    } else {
      seconds--;
      let minutes = Math.floor(seconds / 60);
      let remainingSeconds = seconds % 60;
      timerDisplay.textContent = `${padZero(minutes)}:${padZero(remainingSeconds)}`;
    }
  }, 1000);
}

// Fungsi untuk menambahkan leading zero pada angka kurang dari 10
function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

// Fungsi untuk menghentikan timer
function stopPomodoro() {
  clearInterval(timer);
  isTimerRunning = false;
  alert("Timer dihentikan.");
}

// Fungsi untuk mereset timer
function resetPomodoro() {
  clearInterval(timer);
  isTimerRunning = false;
  document.getElementById('timerDisplay').textContent = '00:00';
  alert("Timer direset.");
}

// Fungsi untuk mereset waktu dan mengatur ulang semua
function refreshPomodoro() {
  clearInterval(timer);
  isTimerRunning = false;
  document.getElementById('timerDisplay').textContent = '00:00';
  totalSessions = 0;
  totalStudyTime = 0;
  updateStats();
  alert("Pomodoro reset dan statistik direset.");
}

// Fungsi mengupdate statistik
function updateStats() {
  document.getElementById('totalSessions').textContent = totalSessions;
  document.getElementById('totalStudyTime').textContent = Math.floor(totalStudyTime);
  document.getElementById('averageStudyTime').textContent = totalSessions > 0 ? Math.floor(totalStudyTime / totalSessions) : 0;

  // Update chart
  updateChart();
}

const ctx = document.getElementById('studyChart').getContext('2d');
const studyChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Waktu Belajar',
        data: [],
        borderColor: '#f57f17',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Garis Statis',
        data: [0, 0.5, 1.0, 1.5, 2.0], 
        borderColor: '#000000',
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        borderDash: [5, 5], 
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        labels: []
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 0.1 
        }
      }
    }
  }
});

// Fungsi untuk menambahkan data ke chart
function updateChart() {
  studyChart.data.labels.push(`Sesi ${totalSessions}`);
  studyChart.data.datasets[0].data.push(totalStudyTime);

  studyChart.update();
}

// Menambahkan task
function addTask() {
  const taskInput = document.getElementById('newTask');
  const taskName = taskInput.value.trim();
  if (taskName === "") {
    alert("Masukkan nama mata pelajaran");
    return;
  }
  
  const taskList = document.getElementById('taskList');
  const row = document.createElement("tr");
  
  const taskNameCell = document.createElement("td");
  taskNameCell.textContent = taskName;
  row.appendChild(taskNameCell);
  
  const statusCell = document.createElement("td");
  statusCell.textContent = "Belum Selesai";
  row.appendChild(statusCell);

  const actionsCell = document.createElement("td");
  
  // Tombol Selesai
  const completeButton = document.createElement("button");
  completeButton.textContent = "Selesai";
  completeButton.onclick = () => {
    statusCell.textContent = "Selesai";
    completeButton.disabled = true; 
    completeButton.style.backgroundColor = "#4CAF50"; 
    alert(`Tugas ${taskName} selesai!`);
  };
  actionsCell.appendChild(completeButton);
  
  // Tombol Hapus
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus";
  deleteButton.onclick = () => row.remove();
  actionsCell.appendChild(deleteButton);
  
  row.appendChild(actionsCell);
  taskList.appendChild(row);
  
  taskInput.value = ""; 
}