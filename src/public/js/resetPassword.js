document.addEventListener("DOMContentLoaded", function () {
    const resetPasswordForm = document.getElementById("resetPasswordForm");
    const resultMessage = document.getElementById("resultMessage");

    resetPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío del formulario

        // Obtener los valores del formulario
        const email = document.getElementById("email").value;
        const newPassword = document.getElementById("newPassword").value;

        // Realizar una solicitud AJAX (puedes usar fetch o jQuery.ajax) para enviar los datos al servidor
        // Aquí deberías enviar estos datos al servidor para procesar el restablecimiento de la contraseña
        // y mostrar un mensaje de resultado en función de la respuesta del servidor

        // Simulación de respuesta exitosa del servidor (esto debería hacerse en el lado del servidor)
        setTimeout(function () {
            resultMessage.textContent = "Contraseña restablecida con éxito";
        }, 2000); // Simulación de un retardo de 2 segundos (para demostración)

        // Limpieza de los campos del formulario
        document.getElementById("email").value = "";
        document.getElementById("newPassword").value = "";
    });
});