    document.addEventListener("DOMContentLoaded", function () {
      const form = document.getElementById("contactForm");
      const projectRadios = document.querySelectorAll('input[name="tipo_proyecto"]');
      const conditionalBlocks = document.querySelectorAll(".conditional");
      const formNote = document.getElementById("formNote");
      hideAllConditionals();
      const params = new URLSearchParams(window.location.search);
      const pack = params.get("pack");
      const packInput = document.getElementById("packInteres");
      const feedback = document.getElementById("formFeedback");
      function showError(message) {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.className = "form-feedback error";
      }
      function clearFeedback() {
        if (!feedback) return;
        feedback.textContent = "";
        feedback.className = "form-feedback";
      }
      if (pack && packInput) {
        packInput.value = pack;
        const packMap = {
          "presencia-esencial": "presencia",
          "presencia-profesional": "presencia",
          "presencia-plus": "presencia",
          "odoo-pos": "comercio"
        };
        const tipo = packMap[pack];
        if (tipo) {
          const radio = document.querySelector(
            `input[name="tipo_proyecto"][value="${tipo}"]`
          );
          if (radio) {
            radio.checked = true;
            showConditional(tipo); 
          }
        }
      }
      function hideAllConditionals() {
        conditionalBlocks.forEach(block => {
          block.style.display = "none";
          block.querySelectorAll("input, select, textarea").forEach(field => {
            if (field.type === "checkbox" || field.type === "radio") {
              field.checked = false;
            } else {
              field.value = "";
            }
          });
        });
      }
      function showConditional(type) {
        hideAllConditionals();
        const activeBlock = document.querySelector(`.conditional[data-type="${type}"]`);
        if (activeBlock) activeBlock.style.display = "block";
      }
      projectRadios.forEach(radio => {
        radio.addEventListener("change", function () {
          showConditional(this.value);
        });
      });
      function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      }
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const nombre = form.querySelector('input[name="nombre"]').value.trim();
        const actividad = form.querySelector('input[name="actividad"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();
        const tipoProyecto = form.querySelector('input[name="tipo_proyecto"]:checked');

        if (!nombre || !actividad || !email) {
          showError("Por favor completá nombre, actividad y email.");
          return;
        }
        if (!isValidEmail(email)) {
          showError("Ingresá un email válido.");
          return;
        }
        if (!tipoProyecto) {
          showError("Indicá qué tipo de proyecto querés ordenar.");
          return;
        }
        const tipo = tipoProyecto.value;
        if (tipo === "presencia") {
          const etapaField = form.querySelector('input[name="etapa_presencia"]:checked');
          const objetivoField = form.querySelector('input[name="objetivo_presencia"]:checked');
          if (!etapaField) {
            showError("Indicá en qué etapa está hoy tu presencia digital.");
            return;
          }
          if (!objetivoField) {
            showError("Indicá el objetivo principal de tu presencia digital.");
            return;
          }
        }
        if (tipo === "comercio") {
          const tipoComercio = form.querySelector('input[name="tipo_comercio"]').value.trim();
          const cantidad = form.querySelector('input[name="cantidad_productos"]:checked');
          const mediosPago = form.querySelectorAll('input[name="medios_pago[]"]:checked');
          if (!tipoComercio || !cantidad) {
            showError("Completá el tipo de comercio y la cantidad de productos.");
            return;
          }
          if (mediosPago.length === 0) {
            showError("Seleccioná al menos un medio de pago.");
            return;
          }
        }
        if (tipo === "indefinido") {
          const problema = form.querySelector('textarea[name="problema"]').value.trim();
          if (!problema) {
            showError("Contanos brevemente qué problema querés resolver.");
            return;
          }
        }
        clearFeedback();
        const data = new FormData(form);
        let body = "Nueva consulta desde ordendigital.com.ar\n\n";

        for (let [key, value] of data.entries()) {
          if (value.trim() !== "") {
            body += `${key.replace(/_/g, " ")}: ${value}\n`;
          }
        }
        const subject = "[Orden Digital] Nueva consulta";
        const mailtoLink =
          "mailto:info@ordendigital.com.ar" +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
        formNote.style.display = "block";
        feedback.textContent = "Formulario completo. Se abrirá tu correo para enviar la consulta.";
        feedback.className = "form-feedback success";
        setTimeout(() => {
          window.location.href = mailtoLink;
        }, 600);
      });
    });
