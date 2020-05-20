var app = new Vue({
    el: '#app',
    data: {
        datos: [],
        mensaje: ''

    },

    methods: {
        getDatos() {
            let url = '/api/datosp';
            axios.get(url).then(response => {
                this.datos = response.data;

            });
        },
        NuevoDato() {
            console.log('Nuevo dato');

            Swal.mixin({
                confirmButtonText: 'Next &rarr;',
                showCancelButton: true,
                progressSteps: ['1', '2', '3']
            }).queue([{
                    title: 'Ingrese nombre completo',
                    text: 'Nombre(s) y apellidos',
                    input: 'text',
                    inputValidator: (value) => {
                        if (!value) {
                            toastr["error"]("Debes ingresar tu nombre", "Error");
                            return ' '
                        }
                    }
                },
                {
                    title: 'Seleccione posición',
                    text: 'Posición de empleado',
                    input: 'select',
                    inputOptions: {
                        auditor: 'Auditor',
                        soporte: 'Soporte',
                        seguridad: 'Seguridad',
                    },
                    inputPlaceholder: 'Selecciona una posición',
                    inputValidator: (value) => {
                        if (!value) {
                            toastr["error"]("Debes seleccionar una opción", "Error");
                            return ' '
                        }
                    }

                },
                {
                    title: 'Ingrese el salario del empleado',
                    text: 'Salario del empleado',
                    input: 'number',
                    inputAttributes: {
                        min: 4,
                        step: 0.01
                    },

                    inputValidator: (value) => {
                        if (!value) {
                            toastr["error"]("Debes ingresar tu salario", "Error");
                            return ' '
                        }
                    }
                },
            ]).then(async(result) => {
                if (result.value) {

                    datos = {
                        nombre: result.value[0],
                        posicion: result.value[1],
                        salario: result.value[2]
                    }

                    let url = '/api/datosp';
                    await axios.post(url, datos).then(response => {
                        this.mensaje = response.data;

                    });

                    this.getDatos();
                    toastr["success"](this.mensaje, "Success");
                }
            })

        },
        EliminarDato(dato) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: true
            })

            swalWithBootstrapButtons.fire({
                title: '¿Estás seguro?',
                html: "Si eliminas el registro de <strong>" + dato.nombre + "</strong>, <br>; Nopodrás revertir esto",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminarlo!',
                cancelButtonText: 'No, cancelar!',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                reverseButtons: true
            }).then(async(result) => {
                if (result.value) {

                    let url = '/api/datosp/' + dato.id;
                    await axios.delete(url).then(response => {
                        this.mensaje = response.data;

                    });

                    this.getDatos();
                    toastr.success(this.mensaje);

                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    toastr["error"]("Acción cancelada");

                }
            })

        },
        EditarDato(dato) {

            formulario = '<div id="swal2-content" class="swal2-html-container" style="display: block;">Nombre(s) y apellidos</div>' +
                '<input id="nombre" name="nombre" class="swal2-input" placeholder="" type="text" style="display: flex;">' +
                '<div id="swal2-content" class="swal2-html-container" style="display: block;">Posición de empleado</div>' +
                '<select id="posicion" name="posicion" class="swal2-select" style="display: flex;"><option value="" disabled="">Selecciona una posición</option><option value="auditor">Auditor</option><option value="soporte">Soporte</option><option value="seguridad">Seguridad</option></select>' +
                '<div id="swal2-content" class="swal2-html-container" style="display: block;">Salario del empleado</div>' +
                '<input id="salario" name="salario" min="4" step="0.01" class="swal2-input" placeholder="" type="number" style="display: flex;">'

            Swal.fire({
                title: 'Editar registro',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Guardar',
                html: formulario,
                focusConfirm: false,
                preConfirm: async() => {

                    ultimoDatosEditados = {

                        nombre: document.getElementById('nombre').value,
                        posicion: document.getElementById('posicion').value,
                        salario: document.getElementById('salario').value

                    };

                    let url = '/api/datosp/' + dato.id;
                    await axios.put(url, ultimoDatosEditados).then(response => {
                        this.mensaje = response.data;

                    });

                    this.getDatos();

                    return toastr.success(this.mensaje);
                }
            })


            document.getElementById('nombre').value = dato.nombre;
            document.getElementById('posicion').value = dato.posicion;
            document.getElementById('salario').value = dato.salario;




        }
    },

    mounted() {
        this.getDatos();
    }

})