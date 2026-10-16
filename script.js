document.addEventListener("DOMContentLoaded", () => {
  // 1. Controle do Overlay do Menu
  const openMenuBtn = document.getElementById("open-menu-btn");
  const closeMenuBtn = document.getElementById("close-menu-btn");
  const menuOverlay = document.getElementById("menu-overlay");
  const menuNavLinks = document.querySelectorAll(".menu-nav-link");

  function openMenu() {
    menuOverlay.classList.remove("hidden");
    menuOverlay.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuOverlay.classList.add("hidden");
    menuOverlay.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  if (openMenuBtn) openMenuBtn.addEventListener("click", openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);

  menuNavLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  if (menuOverlay) {
    menuOverlay.addEventListener("click", (e) => {
      if (e.target === menuOverlay) {
        closeMenu();
      }
    });
  }

  // 2. Navegação Flutuante Lateral (DotNav) & Ativação de Seções
  const sectionIds = ["hero", "instituto", "manifesto", "palestrantes", "flap-lab", "quem", "encontros", "observatorio", "joint"];
  const dotItems = document.querySelectorAll("#dot-nav .dot-item");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionIds.indexOf(entry.target.id);
          if (index !== -1) {
            dotItems.forEach((dot, idx) => {
              if (idx === index) {
                dot.classList.add("active");
              } else {
                dot.classList.remove("active");
              }
            });
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      sectionObserver.observe(section);
    }
  });

  // 3. Animação de Revelação na Seção Excelência
  const excelenciaSection = document.getElementById("excelencia-section");
  const excelenciaReveal = document.getElementById("excelencia-reveal");

  if (excelenciaSection && excelenciaReveal) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            excelenciaReveal.classList.add("excelencia-visible");
          }
        });
      },
      { threshold: 0.2 }
    );
    revealObserver.observe(excelenciaSection);
  }

  // 4. Modal de Vídeo/Reels do Instagram (Observatório)
  const obsCards = document.querySelectorAll(".obs-card");
  const embedModal = document.getElementById("embed-modal");
  const embedIframe = document.getElementById("embed-iframe");
  const closeModalBtn = document.getElementById("close-modal-btn");

  function openModal(embedUrl) {
    if (embedIframe) embedIframe.src = embedUrl;
    if (embedModal) {
      embedModal.classList.remove("hidden");
      embedModal.classList.add("flex");
    }
  }

  function closeModal() {
    if (embedIframe) embedIframe.src = "";
    if (embedModal) {
      embedModal.classList.add("hidden");
      embedModal.classList.remove("flex");
    }
  }

  obsCards.forEach((card) => {
    card.addEventListener("click", () => {
      const url = card.getAttribute("data-embed");
      if (url) openModal(url);
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

  if (embedModal) {
    embedModal.addEventListener("click", (e) => {
      if (e.target === embedModal) {
        closeModal();
      }
    });
  }

  // Navegação do Carrossel de Palestrantes
const carousel = document.getElementById('speakers-carousel');
const prevBtn = document.getElementById('speaker-prev-btn');
const nextBtn = document.getElementById('speaker-next-btn');

if (carousel && prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -320, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: 320, behavior: 'smooth' });
  });
}

  // 6. Envio do Formulário de Contato via FormSubmit AJAX
  const contactForm = document.getElementById("contact-form");
  const contactSuccess = document.getElementById("contact-success");
  const submitBtn = document.getElementById("submit-btn");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "ENVIANDO...";
      }

      try {
        const formData = new FormData(contactForm);

        const response = await fetch(contactForm.action, {
          method: "POST",
          headers: {
            "Accept": "application/json"
          },
          body: formData
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok) {
          contactForm.classList.add("hidden");
          if (contactSuccess) contactSuccess.classList.remove("hidden");
          contactForm.reset();
        } else {
          console.error("Erro FormSubmit:", result);
          alert(result.message || "Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "ENVIAR SOLICITAÇÃO";
          }
        }
      } catch (error) {
        console.error("Erro de conexão no envio:", error);
        alert("Erro de conexão. Verifique sua rede e tente novamente.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "ENVIAR SOLICITAÇÃO";
        }
      }
    });
  }
});

// Funcionalidade de Carrossel do Modal de Folders
document.addEventListener('DOMContentLoaded', () => {
  const encontroCards = document.querySelectorAll('.encontro-card');
  const folderModal = document.getElementById('folder-modal');
  const folderImg = document.getElementById('folder-img');
  const closeFolderBtn = document.getElementById('close-folder-btn');
  const prevFolderBtn = document.getElementById('prev-folder-btn');
  const nextFolderBtn = document.getElementById('next-folder-btn');
  const folderCounter = document.getElementById('folder-counter');

  let currentFolders = [];
  let currentIndex = 0;

  if (encontroCards.length && folderModal && folderImg) {
    // Atualiza a imagem exibida no carrossel
    const updateCarousel = () => {
      if (currentFolders.length > 0) {
        folderImg.src = currentFolders[currentIndex];
        
        // Exibe contador de páginas se houver mais de uma foto
        if (currentFolders.length > 1) {
          folderCounter.textContent = `${currentIndex + 1} / ${currentFolders.length}`;
          prevFolderBtn.classList.remove('hidden');
          nextFolderBtn.classList.remove('hidden');
        } else {
          folderCounter.textContent = '';
          prevFolderBtn.classList.add('hidden');
          nextFolderBtn.classList.add('hidden');
        }
      }
    };

    // Abrir Modal ao clicar no card
    encontroCards.forEach(card => {
      card.addEventListener('click', () => {
        const foldersAttr = card.getAttribute('data-folders') || card.getAttribute('data-folder');
        if (foldersAttr) {
          currentFolders = foldersAttr.split(',').map(item => item.trim());
          currentIndex = 0;
          updateCarousel();
          folderModal.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Navegar para a imagem Anterior
    const showPrev = () => {
      if (currentFolders.length > 1) {
        currentIndex = (currentIndex - 1 + currentFolders.length) % currentFolders.length;
        updateCarousel();
      }
    };

    // Navegar para a Próxima imagem
    const showNext = () => {
      if (currentFolders.length > 1) {
        currentIndex = (currentIndex + 1) % currentFolders.length;
        updateCarousel();
      }
    };

    // Eventos de clique nas setas
    if (prevFolderBtn) prevFolderBtn.addEventListener('click', showPrev);
    if (nextFolderBtn) nextFolderBtn.addEventListener('click', showNext);

    // Função para Fechar Modal
    const closeFolderModal = () => {
      folderModal.classList.add('hidden');
      folderImg.src = '';
      currentFolders = [];
      currentIndex = 0;
      document.body.style.overflow = '';
    };

    // Eventos de Fechamento
    if (closeFolderBtn) closeFolderBtn.addEventListener('click', closeFolderModal);

    folderModal.addEventListener('click', (e) => {
      if (e.target === folderModal) {
        closeFolderModal();
      }
    });

    // Navegação via Teclado (Setas do Teclado e ESC)
    document.addEventListener('keydown', (e) => {
      if (!folderModal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeFolderModal();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  }
});