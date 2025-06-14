const wsp_oficina_clientes = "5493585024891";
const abrirMenu = document.querySelector("#menu-abir");
const cerrarMenu = document.querySelector("#menu-cerrar");
const navbar = document.querySelector("#navbar");
const nav = document.querySelector("#nav");
const navLinks = document.querySelectorAll("a");

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
        <p>Para continuar con la cotización, te invitamos a que con contactes por WhatsApp.</p>
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
  // Corregido: 12 meses = 1.5%, 24 meses = 3%, 36 meses = 4.5%
  let tasaTriunfo;
  if (meses === 12) {
    tasaTriunfo = 0.015; // 1.5%
  } else if (meses === 24) {
    tasaTriunfo = 0.03; // 3%
  } else if (meses === 36) {
    tasaTriunfo = 0.045; // 4.5%
  }

  const costoTriunfo = Math.round(sumaAsegurada * tasaTriunfo);

  // Calcular para BBVA (5% para cualquier vigencia)
  const costoBBVA = Math.round(sumaAsegurada * 0.05);

  // Calcular para Sancor (5.5% solo para 24 meses)
  const costoSancor = meses === 24 ? Math.round(sumaAsegurada * 0.055) : null;

  // Construir tarjetas de resultados
  let cardsHTML = `
        <div class="card card-green">
          <img src="./assets/images/logo-TS.png" alt="Triunfo Seguros Logo" class="company-logo" />
          <h4>Triunfo Seguros</h4>
          <p><strong>Suma Asegurada:</strong> ${sumaAsegurada.toLocaleString()}</p>
          <p><strong>Tasa aplicada:</strong> ${tasaTriunfo * 100}%</p>
          <p><strong>Contado:</strong> ${costoTriunfo.toLocaleString()}</p>
          <p><strong>3 cuotas sin interés:</strong> ${Math.round(
            costoTriunfo / 3
          ).toLocaleString()} c/u</p>
          <button class="whatsapp-btn" onclick="enviarWhatsApp('Triunfo Seguros', ${costoTriunfo}, ${Math.round(
    costoTriunfo / 3
  )})">
            <i class="fa-brands fa-whatsapp"></i> Contratar Servicio
          </button>
        </div>
    
        <div class="card card-blue">
          <img src="./assets/images/logo-BBVA.svg" alt="BBVA Logo" class="company-logo" />
          <h4>BBVA</h4>
          <p><strong>Suma Asegurada:</strong> ${sumaAsegurada.toLocaleString()}</p>
          <p><strong>Tasa aplicada:</strong> 5%</p>
          <p><strong>Contado:</strong> ${costoBBVA.toLocaleString()}</p>
          <p><strong>3 cuotas sin interés:</strong> ${Math.round(
            costoBBVA / 3
          ).toLocaleString()} c/u</p>
          <button class="whatsapp-btn" onclick="enviarWhatsApp('BBVA', ${costoBBVA}, ${Math.round(
    costoBBVA / 3
  )})">
            <i class="fa-brands fa-whatsapp"></i> Contratar Servicio
          </button>
        </div>
      `;

  // Solo mostrar Sancor si es para 24 meses
  if (costoSancor !== null) {
    cardsHTML += `
          <div class="card card-purple">
            <img src="./assets/images/logo-GSS.png" alt="Sancor Seguros Logo" class="company-logo" />
            <h4>Sancor Seguros</h4>
            <p><strong>Suma Asegurada:</strong> ${sumaAsegurada.toLocaleString()}</p>
            <p><strong>Tasa aplicada:</strong> 5.5%</p>
            <p><strong>Contado:</strong> ${costoSancor.toLocaleString()}</p>
            <p><strong>3 cuotas sin interés:</strong> ${Math.round(
              costoSancor / 3
            ).toLocaleString()} c/u</p>
            <p><em>*Solo disponible para contratos de 24 meses</em></p>
            <button class="whatsapp-btn" onclick="enviarWhatsApp('Sancor Seguros', ${costoSancor}, ${Math.round(
      costoSancor / 3
    )})">
              <i class="fa-brands fa-whatsapp"></i> Contratar Servicio
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
