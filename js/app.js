// Variables
const formulario = document.querySelector("#agregar-gasto")
const gastoListado = document.querySelector("#gastos ul")



// Eventos
eventListeners()
function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto)

    formulario.addEventListener("submit", agregarGasto)
}


// Clases

class Presupuesto  {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado

        console.log(gastado)
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id)
        this.calcularRestante();

        console.log(this.gastos)
    }
}

class UI {
    
    insertarPresupuesto(cantidad) {
        const {presupuesto, restante} = cantidad;
        document.querySelector("#total").textContent = presupuesto
        document.querySelector("#restante").textContent = restante
    }

    imprimirAlerta(mensaje, tipo){
        let divMensaje = document.createElement("div")
        divMensaje.classList.add("text-center", "alert")

        if (tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success")
        }

        divMensaje.textContent = mensaje

        document.querySelector(".primario").insertBefore(divMensaje, formulario)


        setTimeout(() => {
            divMensaje.remove()
        }, 2000);
    }

    agregarGastoListado(gastos) {

        this.limpiarHTML();

        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto

            // Crear un li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.classList = "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.dataset.id = id;

            
            // Agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad} </span>`
            
            // Boton para borrar el gasto
            const btnBorrar = document.createElement("btn");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML =  "Borrar &times"
            btnBorrar.onclick = () => {
                eliminarGasto(id)
            }

            nuevoGasto.appendChild(btnBorrar)

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto)



        });
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante) {
        document.querySelector("#restante").textContent = restante
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj
        
        const restanteDiv = document.querySelector(".restante")

        // comprobar 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove("alert-success", "alert-warning")
            restanteDiv.classList.add("alert-danger")
        } else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove("alert-success")
            restanteDiv.classList.add("alert-warning")
        }else {
            restanteDiv.classList.remove("alert-danger", "alert-warning")
            restanteDiv.classList.add("alert-success")

        }

        // Si el total es 0 o menor

        if (restante <= 0) {
            ui.imprimirAlerta("El presupuesto se ha agotado", "error")

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }

}

// Instanciar
const ui = new UI()

let presupuesto;
// Funciones


function preguntarPresupuesto() {
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?")


    if (presupuestoUsuario  === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload()
    }

    presupuesto = new Presupuesto(presupuestoUsuario)



    ui.insertarPresupuesto(presupuesto)
}

// Añade Gastos

function agregarGasto(e) {
    e.preventDefault();
    
    const nombre = document.querySelector("#gasto").value
    const cantidad = Number(document.querySelector("#cantidad").value)

    if ([nombre, cantidad].includes("")) {
        ui.imprimirAlerta("Ambos campos son obligatorio", "error")

        return
    } else if (cantidad <=0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Cantidad no valida", "error")

        return
    }

    // Generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}
    presupuesto.nuevoGasto(gasto)

    // Mensaje de exito
    ui.imprimirAlerta("Gasto agregado")

    // Imprimir los gastos

    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos)

    ui.actualizarRestante(restante)

    ui.comprobarPresupuesto(presupuesto)

    // Reinicia el formulario
    formulario.reset()
}

function eliminarGasto(id) {
    // Elimina los gastos del Objeto
    presupuesto.eliminarGasto(id)

    // Elimina los gastos del HTML
    const {gastos, restante} = presupuesto
    ui.agregarGastoListado(gastos)

    ui.actualizarRestante(restante)

    ui.comprobarPresupuesto(presupuesto)
}