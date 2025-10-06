 // === Typing effect ===
const typingText = document.getElementById("typing-text");
const words = ["Game Developer", "Game Designer", "Web3 Creator", "Multiplayer Engineer"];
let i = 0, j = 0, isDeleting = false;

function typeEffect() {
  let current = words[i];
  typingText.textContent = current.substring(0, j) + (j === current.length && !isDeleting ? "" : "|"); 
  
  if (!isDeleting && j < current.length) j++;
  else if (isDeleting && j > 0) j--;
  else if (!isDeleting && j === current.length) { 
    isDeleting = true; 
    setTimeout(typeEffect, 1000); 
    return; 
  }
  else { 
    isDeleting = false; 
    i = (i + 1) % words.length; 
  }
  setTimeout(typeEffect, isDeleting ? 50 : 100);
}
typeEffect();

// --- General Functions ---

/**
 * Scrolls to the Contact section smoothly.
 */
function scrollToContact() {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
}


// --- Certificate Functions (UPDATED) ---

const certGrid = document.getElementById("certificate-grid");
const CERT_KEY = "certificates"; // Key for localStorage

// Event listener for custom file upload name display
document.getElementById('cert-image').addEventListener('change', function() {
    const fileName = this.files.length > 0 ? this.files[0].name : "Belum ada file dipilih";
    document.getElementById('cert-image-name').textContent = fileName;
});

/**
 * Loads certificates from localStorage and displays them.
 */
function loadCertificates() {
  const certificates = JSON.parse(localStorage.getItem(CERT_KEY)) || [];
  certGrid.innerHTML = "";
  
  certificates.forEach((c, i) => {
    const div = document.createElement("div");
    // Menambahkan kelas 'certificate-card' untuk styling spesifik
    div.className = "project-card certificate-card"; 
    
    div.innerHTML = `
      ${c.image ? `<img src="${c.image}" alt="Sertifikat ${c.name}" class="certificate-image">` : ''}
      <div class="project-content"> 
        <h3>${c.name}</h3>
        <p>Penerbit: ${c.issuer}</p>
        ${c.link ? `<a href="${c.link}" target="_blank" class="btn">Lihat Sertifikat</a>` : ""}
        <button class="btn" onclick="deleteCertificate(${i})">Hapus</button>
      </div>
    `;
    certGrid.appendChild(div);
  });
}

/**
 * Adds a new certificate to localStorage and reloads the list.
 */
async function addCertificate() {
  const name = document.getElementById("cert-name").value.trim();
  const issuer = document.getElementById("cert-issuer").value.trim();
  const link = document.getElementById("cert-link").value.trim();
  const imageFile = document.getElementById("cert-image").files[0];
  
  if (!name || !issuer) { 
    alert("Nama sertifikat dan penerbit wajib diisi!"); 
    return; 
  }

  let imageData = null;
  if (imageFile) {
    // Read the image file as a Data URL (Base64)
    imageData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null); // Handle errors
      reader.readAsDataURL(imageFile);
    });

    if (!imageData) {
        alert("Gagal membaca file gambar. Coba lagi.");
        return;
    }
    // Optional: Basic validation for image size to prevent localStorage overflow
    if (imageData.length > 3 * 1024 * 1024) { // Roughly 3MB limit for base64 string
        alert("Ukuran gambar terlalu besar! Maksimal 3MB.");
        return;
    }
  }
  
  const certificates = JSON.parse(localStorage.getItem(CERT_KEY)) || [];
  certificates.push({ name, issuer, link, image: imageData });
  localStorage.setItem(CERT_KEY, JSON.stringify(certificates));
  
  // Clear inputs
  document.getElementById("cert-name").value = "";
  document.getElementById("cert-issuer").value = "";
  document.getElementById("cert-link").value = "";
  document.getElementById("cert-image").value = ""; // Clear file input
  document.getElementById("cert-image-name").textContent = "Belum ada file dipilih"; // Reset display
  
  loadCertificates();
}

/**
 * Deletes a certificate from localStorage by index and reloads the list.
 * @param {number} index - The index of the certificate to delete.
 */
function deleteCertificate(index) {
  const certificates = JSON.parse(localStorage.getItem(CERT_KEY)) || [];
  if (confirm(`Yakin ingin menghapus sertifikat: ${certificates[index].name}?`)) {
    certificates.splice(index, 1);
    localStorage.setItem(CERT_KEY, JSON.stringify(certificates));
    loadCertificates();
  }
}


// --- Project Functions (UNTOUCHED) ---

const projectGrid = document.getElementById("project-grid");
const PROJECT_KEY = "projects"; // Key for localStorage

// Event listener for custom file upload name display for projects
document.getElementById('project-image').addEventListener('change', function() {
    const fileName = this.files.length > 0 ? this.files[0].name : "Belum ada file dipilih";
    document.getElementById('project-image-name').textContent = fileName;
});


/**
 * Loads projects from localStorage and displays them.
 */
function loadProjects() {
  const projects = JSON.parse(localStorage.getItem(PROJECT_KEY)) || [];
  projectGrid.innerHTML = "";
  
  projects.forEach((p, i) => {
    // Memecah string tools menjadi array, jika ada
    const toolsArray = p.tools ? p.tools.split(',').map(tool => `<span>${tool.trim()}</span>`).join('') : '';

    const div = document.createElement("div");
    div.className = "project-card";
    div.innerHTML = `
      ${p.image ? `<img src="${p.image}" alt="Cover ${p.name}" class="project-thumbnail">` : ''}
      <div class="project-content">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="project-tools">${toolsArray}</div>
        ${p.link ? `<a href="${p.link}" target="_blank" class="btn">Lihat Project</a>` : ""}
        <button class="btn" onclick="deleteProject(${i})">Hapus</button>
      </div>
    `;
    projectGrid.appendChild(div);
  });
}

/**
 * Adds a new project to localStorage and reloads the list.
 */
async function addProject() {
  const name = document.getElementById("game-name").value.trim();
  const desc = document.getElementById("game-desc").value.trim();
  const tools = document.getElementById("game-tools").value.trim(); 
  const link = document.getElementById("game-link").value.trim();
  const imageFile = document.getElementById("project-image").files[0]; 
  
  if (!name || !desc || !tools) { 
    alert("Isi nama, deskripsi, dan tools!"); 
    return; 
  }

  // Handle image conversion to Base64 (similar to certificates)
  let imageData = null;
  if (imageFile) {
    imageData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(imageFile);
    });

    if (!imageData) {
        alert("Gagal membaca file gambar. Coba lagi.");
        return;
    }
    // Batasan ukuran gambar
    if (imageData.length > 2 * 1024 * 1024) { // 2MB limit for base64 string
        alert("Ukuran gambar project terlalu besar! Maksimal 2MB.");
        return;
    }
  }
  
  const projects = JSON.parse(localStorage.getItem(PROJECT_KEY)) || [];
  // Simpan data tools dan gambar
  projects.push({ name, desc, tools, link, image: imageData }); 
  localStorage.setItem(PROJECT_KEY, JSON.stringify(projects));
  
  // Clear inputs
  document.getElementById("game-name").value = "";
  document.getElementById("game-desc").value = "";
  document.getElementById("game-tools").value = ""; 
  document.getElementById("game-link").value = "";
  document.getElementById("project-image").value = ""; // Clear file input
  document.getElementById("project-image-name").textContent = "Belum ada file dipilih"; // Reset display
  
  loadProjects();
}

/**
 * Deletes a project from localStorage by index and reloads the list.
 * @param {number} index - The index of the project to delete.
 */
function deleteProject(index) {
  const projects = JSON.parse(localStorage.getItem(PROJECT_KEY)) || [];
  if (confirm(`Yakin ingin menghapus proyek: ${projects[index].name}?`)) {
    projects.splice(index, 1);
    localStorage.setItem(PROJECT_KEY, JSON.stringify(projects));
    loadProjects();
  }
}


// --- Initialization ---

// Call load functions on window load
window.onload = function() {
    loadProjects();
    loadCertificates();
}