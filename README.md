# NEXO Producciones

Sitio web para mostrar **eventos artísticos y culturales**, con compra de entradas mediante Mercado Pago.

---

## 💻 Tecnologías

- HTML5
- CSS (Tailwind CSS)
- JavaScript (Vanilla JS)
- Google Sheets (para almacenar eventos)
- GitHub Pages (deploy gratuito)

---

## 📅 Funcionalidades

- Mostrar **próximos eventos** en tarjetas con imagen, fecha, lugar y precio.  
- Precio unitario visible en la tarjeta antes de comprar.  
- **Eventos agotados** muestran un badge rojo “AGOTADO”.  
- Modal para **seleccionar cantidad de entradas** y calcular el total.  
- Alias de pago: `pepemoli.mp` (Mercado Pago).  
- Maneja fechas en formato `DD/MM/YYYY` desde Google Sheets.  
- Fallback de imágenes si la URL no existe.

---

## 🗂 Estructura del proyecto

nexo-producciones/
├─ index.html → archivo principal
├─ imagenes/ → imágenes de los eventos
└─ README.md → documentación del proyecto


---

## ⚡ Uso

1. Abrir `index.html` en cualquier navegador.  
2. Seleccionar el evento que quieras.  
3. Pulsar **“Comprar entrada”**, elegir la cantidad y ver el total.  
4. Realizar el pago usando el alias de Mercado Pago.

---

## 🔗 Deploy

Sitio en GitHub Pages:  



---

## 📝 Notas

- Los eventos se cargan dinámicamente desde Google Sheets vía `opensheet.elk.sh`.  
- Para agregar un evento nuevo, solo hay que actualizar la hoja de cálculo pública.
