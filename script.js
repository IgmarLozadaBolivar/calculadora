// Ventana emergente de Bienvenida
Swal.fire({
    title: '¡Bienvenido!',
    text: 'Gracias por visitar nuestro sitio web.',
    icon: 'info',
    confirmButtonText: 'Aceptar'
});

// Fondo de video
var videoElement = document.getElementById("videoFondo");

function videoCarga() {
    var videoFuente = document.createElement("source");
    videoFuente.src = "./video/intro.mp4";
    videoFuente.type = "video/mp4";
    videoElement.appendChild(videoFuente);
    videoElement.load();
}
videoCarga();

// Se define una clase Calculadora con su constructor y metodos
class Calculadora {
    constructor() {
        this.valorActual = '';
        this.operador = '';
        this.valorAnterior = '';
        this.historial = [];
        this.botonBorrar = null;
    }

    // Actualiza el valor en el display
    actualizarDisplay(expresion) {
        const display = document.getElementById('display');
        display.value = expresion;
    }

    // Muestra u oculta el boton de eliminar del historial operaciones
    alternarBotonBorrar() {
        if (this.historial.length > 0) {
            this.botonBorrar.style.display = 'block';
        } else {
            this.botonBorrar.style.display = 'none';
        }
    }

    // Maneja los numeros clicados por los usuarios
    numerosCliqueados(numero) {
        this.valorActual += numero;
        const expresion = this.valorAnterior + ' ' + this.operador + ' ' + this.valorActual;
        this.actualizarDisplay(expresion);
    }

    // Maneja los operadores clicados por el usuario
    operadoresCliqueados(operador) {
        this.operador = operador;
        this.valorAnterior = this.valorActual;
        this.valorActual = '';
        const expresion = this.valorAnterior + ' ' + this.operador;
        this.actualizarDisplay(expresion);
    }

    // Elimina todo el historial de operaciones que existente
    borrarHistorial() {
        this.historial = [];
        this.renderizarHistorial();
        this.alternarBotonBorrar();

        // Muestra una ventana emergente con SweetAlert2
        Swal.fire({
            title: 'Historial eliminado',
            text: 'Tu historial de operaciones ha sido eliminado con exito.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
        });
    }

    // Realiza tal operacion y muestra el resultado de ella
    calcular() {
        const valorPrevio = parseFloat(this.valorAnterior);
        const actualValor = parseFloat(this.valorActual);
        let resultado = '';

        switch (this.operador) {
            case '+':
                resultado = valorPrevio + actualValor;
                break;
            case '-':
                resultado = valorPrevio - actualValor;
                break;
            case '*':
                resultado = valorPrevio * actualValor;
                break;
            case '/':
                resultado = valorPrevio / actualValor;
                break;
            default:
                resultado = actualValor;
                break;
        }

        this.valorAnterior = this.valorActual;
        this.valorActual = resultado.toString();
        this.actualizarDisplay(this.valorActual);

        // Agregarla operacion ya realizada al historial de operaciones
        const operacion = {
            valorPrevio: valorPrevio.toString(),
            actualValor: actualValor.toString(),
            operador: this.operador,
            resultado: resultado.toString()
        };
        this.historial.push(operacion);

        this.renderizarHistorial();
        this.alternarBotonBorrar();
    }

    // Mostrar el resultado en una ventana emergente con efecto de carga en el boton (Aceptar)
    mostrarResultado() {
        const valorPrevio = this.valorAnterior;
        const actualValor = this.valorActual;
        const operador = this.operador;
        let resultado = '';

        this.calcular();
        resultado = this.valorActual;

        let mostrarExpresionMatematica = valorPrevio + ' ' + operador + ' ' + actualValor;

        if (operador === '' || actualValor === '') {
            mostrarExpresionMatematica = resultado;
        } else if (valorPrevio === '') {
            mostrarExpresionMatematica = mostrarExpresionMatematica.substring(2);
        }

        Swal.fire({
            title: 'Resultado',
            text: mostrarExpresionMatematica + ' = ' + resultado,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            showCancelButton: false,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
            },
        }).then(() => {
            // Animacion del boton de carga utilizando la libreria de Anime.js
            const loader = document.createElement('div');
            loader.classList.add('loader');
            Swal.getConfirmButton().appendChild(loader);

            anime({
                targets: loader,
                rotate: '1turn',
                duration: 1000,
                easing: 'easeInOutSine',
                loop: true,
            }).finished.then(() => {
                Swal.fire({
                    title: '¡Operacion Resuelta!',
                    text: 'Tu operacion matematica ha sido resuelta con exito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    Swal.fire({
                        title: '¡Gracias!',
                        text: 'Agradecemos que hayas utilizado nuestros servicios.',
                        icon: 'info',
                        confirmButtonText: 'Aceptar',
                    });
                });
            });
        });
    }

    // Limpiar el display y reiniciar sus valores
    limpiarDisplay() {
        this.valorActual = '';
        this.operador = '';
        this.valorAnterior = '';
        this.actualizarDisplay('');
    }

    // Mostrar el historial de operaciones
    renderizarHistorial() {
        const listaHistorial = document.getElementById('lista-historial');
        listaHistorial.innerHTML = '';

        this.historial.forEach((operacion) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${operacion.valorPrevio} ${operacion.operador} ${operacion.actualValor} = ${operacion.resultado}`;
            listaHistorial.appendChild(listItem);
        });

        if (!this.botonBorrar) {
            // Crea el boton de eliminar historial si no existe
            this.botonBorrar = document.createElement('button');
            this.botonBorrar.innerHTML = 'Eliminar Historial';
            this.botonBorrar.classList.add('clear-history-button');
            this.botonBorrar.addEventListener('click', () => {
                this.borrarHistorial();
            });
        }

        if (this.historial.length > 0 && !this.botonBorrar.parentNode) {
            // Agrega el boton de eliminar historial si hay operaciones y si no llega a estar presente
            listaHistorial.appendChild(this.botonBorrar);
        } else if (this.historial.length === 0 && this.botonBorrar.parentNode) {
            // Elimina el boton de eliminar historial si no hay operaciones y si llega a estar presente
            this.botonBorrar.parentNode.removeChild(this.botonBorrar);
        }
    }
}

// Crear una instancia de la calculadora
const calculator = new Calculadora();