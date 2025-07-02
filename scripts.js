// PATHS
const path_to_bbva_logo = "./assets/images/logos/BBVA.svg";
const path_to_sancor_logo = "./assets/images/logos/sancor.png";
const path_to_triunfo_logo = "./assets/images/logos/triunfo.png";

// URLs
const url_to_thank_you_page = "./gracias.html"

// DATOS EMPRESA
const wsp_oficina_clientes = "5493585024891";

// ELEMENTOS DEL HTML
const abrirMenu = document.querySelector("#menu-abir");
const cerrarMenu = document.querySelector("#menu-cerrar");
const navbar = document.querySelector("#navbar");
const nav = document.querySelector("#nav");
const navLinks = document.querySelectorAll("a");
const header = document.querySelector("header");

/*Header scroll handling*/
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScroll && currentScroll > 50) {
    // Scrolling down
    header.classList.add("hide");
  } else {
    // Scrolling up
    header.classList.remove("hide");
  }

  lastScroll = currentScroll;
});

/*NAVBAR menu*/
abrirMenu.addEventListener('click', () => {
  nav.classList.add('visible');
});

cerrarMenu.addEventListener('click', () => {
  nav.classList.remove('visible');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    // ocultar menu desplegado
    nav.classList.remove('visible');
  })
});

/*POP UP*/
function openPopup() {
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("cotizacionForm").reset();
  document.getElementById("resultado").innerHTML = "";
}

// Esta función faltaba en tu código original
function closePopupResultados() {
  document.getElementById("popupResultados").style.display = "none";
  // También cerrar el popup principal al cerrar resultados
  closePopup();
}

function volver() {
  document.getElementById("popupResultados").style.display = "none";
  openPopup();
}

function calcularSeguro(event) {
  event.preventDefault();

  const alquiler = parseFloat(document.getElementById("alquiler").value);
  const meses = parseInt(document.getElementById("meses").value);
  const tipo = document.getElementById("tipo").value;

  if (!alquiler || !meses || !tipo) return;

  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;

  const sumaAsegurada = alquiler * meses;

  if (tipo == "comercial") {
    // derivar al wsp
    let cardsHTML = `
      <div class="card card-green">
        <p>Para continuar con la cotización, te invitamos a que nos contactes por WhatsApp.</p>
        <button class="whatsapp-btn" onclick="derivarWhatsApp()">
          <i class="fa-brands fa-whatsapp"></i> Contactar por WhatsApp
        </button>
      </div>
    `;

    document.getElementById("resultCards").innerHTML = cardsHTML;

    // Cerrar el popup de cotización y mostrar el de resultados
    document.getElementById("popup").style.display = "none";
    document.getElementById("popupResultados").style.display = "flex";

    return;
  }

  // Calcular para Triunfo Seguros
  // Corregido: 12 meses , 24 meses = 3%, 36 meses = 4.5%
  let tasaTriunfo;
  if (meses === 12) {
    tasaTriunfo = 0.03; // 3% (corrección nueva)
  } else if (meses === 24) {
    tasaTriunfo = 0.03; // 3%
  } else if (meses === 36) {
    tasaTriunfo = 0.045; // 4.5%
  }

  const costoTriunfo = Math.round(sumaAsegurada * tasaTriunfo);

  // Calcular para BBVA (5% para cualquier vigencia y 15% bonificación)
  const costoBBVA = Math.round(sumaAsegurada * 0.05);
  const costoBBVA_descuento = Math.round(costoBBVA * 0.85);
  const cuotasBBVA_3 = Math.round(costoBBVA / 3);

  // Calcular para Sancor (5.5% solo para 24 meses y 25% bonificación)
  const costoSancor = meses === 24 ? Math.round(sumaAsegurada * 0.055) : null;
  const costoSancor_descuento = Math.round(costoSancor * 0.75);
  const cuotasSancor_3 = Math.round(costoSancor / 3);

  // Construir tarjetas de resultados
  let cardsHTML = `
        <div class="card card-green">
          <img src=${path_to_triunfo_logo} alt="Triunfo Seguros Logo" class="company-logo" />
          
          <p><strong>Suma Asegurada:</strong> ${sumaAsegurada.toLocaleString()}</p>
          <p><strong>Contado:</strong> ${costoTriunfo.toLocaleString()}</p>
          <p><strong>3 cuotas sin interés:</strong> ${Math.round(
            costoTriunfo / 3
          ).toLocaleString()} c/u</p>
          <button class="whatsapp-btn" onclick="enviarWhatsApp('Triunfo Seguros', ${costoTriunfo}, ${Math.round(
    costoTriunfo / 3
  )})">
            <i class="fa-brands fa-whatsapp"></i> Contratar
          </button>
        </div>
    
        <div class="card card-blue">
          <img src=${path_to_bbva_logo} alt="BBVA Logo" class="company-logo" />
          
          <p><strong>Suma Asegurada:</strong> ${sumaAsegurada.toLocaleString()}</p>
          <p><strong>Contado:</strong> ${costoBBVA_descuento.toLocaleString()}</p>
          <p><strong>3 cuotas sin interés:</strong> ${Math.round(
            cuotasBBVA_3
          ).toLocaleString()} c/u</p>
          <button class="whatsapp-btn" onclick="enviarWhatsApp('BBVA', ${costoBBVA_descuento}, ${Math.round(cuotasBBVA_3)})">
            <i class="fa-brands fa-whatsapp"></i> Contratar
          </button>
        </div>
      `;

  // Solo mostrar Sancor si es para 24 meses
  if (costoSancor !== null) {
    cardsHTML += `
          <div class="card card-purple">
            <img src=${path_to_sancor_logo} alt="Sancor Seguros Logo" class="company-logo" />
            
            <p><strong>Suma Asegurada:</strong> ${sumaAsegurada.toLocaleString()}</p>
            <p><strong>Contado:</strong> ${costoSancor_descuento.toLocaleString()}</p>
            <p><strong>3 cuotas sin interés:</strong> ${Math.round(
              cuotasSancor_3
            ).toLocaleString()} c/u</p>
            <p><em>*Solo disponible para contratos de 24 meses</em></p>
            <button class="whatsapp-btn" onclick="enviarWhatsApp('Sancor Seguros', ${costoSancor_descuento}, ${Math.round(
      cuotasSancor_3
    )})">
              <i class="fa-brands fa-whatsapp"></i> Contratar
            </button>
          </div>
        `;
  }

  document.getElementById("resultCards").innerHTML = cardsHTML;

  // Cerrar el popup de cotización y mostrar el de resultados
  document.getElementById("popup").style.display = "none";
  document.getElementById("popupResultados").style.display = "flex";
}

// Validación para el campo teléfono - solo números
document.addEventListener("DOMContentLoaded", function () {
  const telefonoInput = document.getElementById("telefono");
  if (telefonoInput) {
    telefonoInput.addEventListener("input", function (e) {
      // Solo permite números
      this.value = this.value.replace(/[^\d]/g, "");
    });
  }
});

// Agregar funcionalidad para enviar cotización por WhatsApp
function enviarWhatsApp(compania, costo, cuotaMensual) {
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;
  const alquiler = document.getElementById("alquiler").value;
  const meses = document.getElementById("meses").value;

  const mensaje = `¡Hola! Me interesa contratar el seguro de caución de *${compania}*.
  
  *Mis datos:*
  • Nombre: ${nombre}
  • Email: ${email}
  • Teléfono: ${telefono}
  • Monto de alquiler: ${parseFloat(alquiler).toLocaleString()}
  • Duración del contrato: ${meses} meses
  
  *Cotización seleccionada:*
  • Costo total: ${costo.toLocaleString()} (contado)
  • 3 cuotas sin interés: ${cuotaMensual.toLocaleString()} c/u
  
  ¿Podrían contactarme para continuar con el trámite?
  
  ¡Gracias!`;

  // Número de WhatsApp de Grupo Scoppa - cambiar por el número real
  const whatsappUrl = `https://wa.me/${wsp_oficina_clientes}?text=${encodeURIComponent(
    mensaje
  )}`;
  window.open(whatsappUrl, "_blank");
}

// Agregar funcionalidad para derivar por WhatsApp si elige comercial
function derivarWhatsApp() {
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;
  const alquiler = document.getElementById("alquiler").value;
  const meses = document.getElementById("meses").value;

  const mensaje = `¡Hola! Me interesa contratar un seguro de caución *comercial*.
  
  *Mis datos:*
  • Nombre: ${nombre}
  • Email: ${email}
  • Teléfono: ${telefono}
  • Monto de alquiler: ${parseFloat(alquiler).toLocaleString()}
  • Duración del contrato: ${meses} meses
  
  ¿Podrían contactarme para continuar con el trámite?
  
  ¡Gracias!`;

  // Número de WhatsApp de Grupo Scoppa - cambiar por el número real
  const whatsappUrl = `https://wa.me/${wsp_oficina_clientes}?text=${encodeURIComponent(
    mensaje
  )}`;
  window.open(whatsappUrl, "_blank");
}

// Redireccionar a una página de agradecimiento
document.querySelector('#contact-form').addEventListener('submit', function(event) {
  event.preventDefault();
  window.location.href = url_to_thank_you_page;
});
