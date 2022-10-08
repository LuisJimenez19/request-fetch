"use strict"
/* Peticion con fetch, y await */
const container = document.querySelector('.container')
const urlData = 'https://jsonplaceholder.typicode.com/posts'
const urlImageDog = 'https://dog.ceo/api/breeds/image/random'

/* LOAD */
const load = document.querySelector('.prev');

/* form*/
const fomrContainer = document.querySelector('.form-bg');

const inputName = document.querySelector('.form__name');
const inputQuantity = document.querySelector('.form__quantity')
const submit = document.querySelector('.form__btn');


submit.addEventListener('click', async () => {
    console.log('click')
    let requestUser = await postUser()
    if (requestUser) {

        let header = document.createElement('header');
        header.className = 'header'

        if (typeof requestUser.quantity != "number") {
            console.log(requestUser.quantity != "number")
            console.log('es null')
            
            header.innerHTML =
            `   <div>
                    <span>Bienvenid@ ${requestUser.name} usuario: ${requestUser.id}</span>
                    <span class="quantity-error" > Por favor ingresa un número del 1 al 100</span>
                </div>
                <button class="refresh" id="refresh">Recargar</button>
          `
            
        } else {
            header.innerHTML =
            `   <div>
            <span>Bienvenid@ ${requestUser.name} usuario: ${requestUser.id}</span>
            <span> has elegido ver ${requestUser.quantity} dogs</span>
            </div>
            <button class="refresh" id="refresh">Recargar</button>
            `
        }

        container.appendChild(header)

        container.classList.toggle('d-none')
        fomrContainer.classList.toggle('d-none')

       

        
        container.appendChild(header)
        let refresh = document.getElementById('refresh');
        refresh.addEventListener('click', _ => {
            location.reload();
        })


        main()
    } else {
        [false, showError(requestUser)]
    }

    console.log(requestUser)

})



const postUser = async () => {

    try {

        const solicitud = await fetch(`${urlData}`, {
            method: 'POST',
            body: JSON.stringify({
                name: `${inputName.value}`,
                quantity: parseInt(`${inputQuantity.value}`)
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })


        return await solicitud.json()

    } catch (error) {
        console.log(error)
        return [false, error]
    }

}



// información random de por ahí
const getInfo = async () => {



    try {
        let data = await fetch(`${urlData}`)
        if (data.status == 200 || data.status == 201) {
            return data.json();
        } else {
            throw data.status
        }

    } catch (error) {
        console.log(error)
        return [false, error];
    }

}

// fotos de perritos random
const getUrlImage = async () => {

    try {
        const urlImage = await (await fetch(`${urlImageDog}`)).json();
        let url = await urlImage.message;
        return await url

    } catch (error) {
        return [false, error];
    }

}
/* Creo un arreglo con las hp 100 miagenes de mierda priobas */
/* async function imagenes() {
    alert('s')
    let arrayImagenes = []
    for (let index = 0; index < 100; index++) {

        let img = await getUrlImage()
        console.log(img)
        arrayImagenes.push(await img)
    }
    console.log(arrayImagenes)
} */

// imagenes()


// actualiza el array
async function chooseInfo() {

    let data = await getInfo()
    /* Por si hay un error retorno el error para mostrarlo en pantalla */
    if (data[0] != false) {
        let a = await postUser()
        data = data.slice(0, a.quantity);

        /* al array de objetos le añado una imagen de la otra api para poder ahcerme el pro */
        for (let i = 0; i < data.length; i++) {
            let img = await getUrlImage()
            data[i].image = await img
        }
        return await data




    } else {
        console.log('error ' + data[1])
        return [data[0], data[1]]
    }

}

/* muestro el error */
function showError(info) {
    console.log('Ha ocurrido un error en la carga')
    console.log(info)
    let divErrorModal =
        `<div class="modal-bg">
                <div class="modal-error">
                    <div class="error">
                        <h1 class="error__title">${info[1]}</h1>
                        ha ocurrido un error verifique su conexión a internet
                    </div>
                </div>
            </div>
            `
    load.classList.toggle('d-none')
    container.classList.toggle('d-none')
    container.innerHTML += divErrorModal
}


// Obtengo los objetos y puedo
async function main() {

    let info = await chooseInfo()



    if (info[0] == false) {

        showError(info)
        /* creo los elementos y los agrego */

    } else {

        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container show-up'

        console.time('cargar todo los usuarios actualizados con las imagenes')
        info.forEach(user => {
            let divUser =

                `<div class="grid-item item${user.id}" id="${user.id}">

                    <div class="user-container">
                        <div class="img">
                            <img src="${user.image}">  
                        </div>
                        <h1>${user.title}<h1>
                    </div>
                    <hr>
                    <div class="description-container">
                        <p>${user.body}</p>
                    </div>

                </div>`


            gridContainer.innerHTML += divUser
        })
        console.timeEnd('cargar todo los usuarios actualizados con las imagenes')
        load.classList.toggle('d-none')
        container.appendChild(gridContainer)


        /* Le damos un span de 2 columnas a las contenedores de imagenes pequeñas para hacerlo mas guapo */


        const gridItems = document.querySelectorAll('.grid-item');


        /* Como tarda en cargar la imagen entonces debo darle tiempo para que quedo con el tamaño real */
        /* Que solo le añada ese estilo en ventanas mayores a 500px */

        if (window.innerWidth >= 700) {
            gridContainer.classList.remove('grid-container--mobile');
            gridContainer.classList.add('grid-container')

            gridItems.forEach(item => {
                setTimeout(() => {
                    if (item.firstElementChild.firstElementChild.clientHeight <= 200) {
                        item.classList.add('grid-item--span')
                    }
                }, 1000)
            })
            
        }
        



        window.addEventListener('resize', (e) => {

            if (window.innerWidth >= 700) {
                gridContainer.classList.remove('grid-container--mobile');
                gridContainer.classList.add('grid-container')

                gridItems.forEach(item => {
                        if (item.firstElementChild.firstElementChild.clientHeight <= 200) {
                            item.classList.add('grid-item--span')
                        }
                    
                })

            } else {
                gridItems.forEach(item => { item.classList.remove('grid-item--span') })
                gridContainer.classList.add('grid-container--mobile')
            }


        })




    }
}
