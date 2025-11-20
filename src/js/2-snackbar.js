import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector("form");
function createPromise(delay, data) {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data === "fulfilled") {
                resolve(`✅ Fulfilled promise in ${delay}ms`);
            } else if (data === "rejected") {
                reject(`❌ Rejected promise in ${delay}ms`);
            }
        }, delay);
    }); 
    return promise;
}

form.addEventListener("submit", (event) => {
    event.preventDefault()
    const time = document.querySelector("input").value;
    const checked = document.querySelector("input:checked").value;
    const promise = createPromise(time, checked);
    promise.
        then((value) => {
            iziToast.info({
                message: value,
                color: "#3bcd8d",
                position: "topRight",
                messageColor: "white",
                close: null,
                icon: null,
            });
        })
        .catch((error) => {
            iziToast.info({
                message: error,
                color: "#fd5548",
                position: "topRight",
                messageColor: "white",
                close: null,
                icon: null,
            });
         });
});
