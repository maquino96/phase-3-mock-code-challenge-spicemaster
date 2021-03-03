const divBlend = document.querySelector('div#spice-blend-detail')
const ingredientList = document.querySelector('ul.ingredients-list')
const updateForm = document.querySelector('form#update-form')
const ingredientForm = document.querySelector('form#ingredient-form')


function loadOneBlend (blend) {
    divBlend.dataset.blend = blend.id 

    const imgBlend = divBlend.querySelector('img.detail-image')
    imgBlend.src = blend.image 
    imgBlend.alt = blend.title

    const h2Blend = divBlend.querySelector('h2.title')
    h2Blend.innerText = blend.title


    updateForm.dataset.id = blend.id
    ingredientForm.dataset.id = blend.id

}

function updateIngredients (ingredientsArr) {

    ingredientsArr.forEach( ingredient => {
        li = document.createElement('li')
        li.innerHTML = ingredient

        ingredientList.append(li)
        // debugger
    })

}

function spotLightedSpice (){

    let blendID = 0; 

    fetch(`http://localhost:3000/spiceblends`)
        .then( r => r.json())
        .then( blend => {
            
            blendID = blend[0].id 
            loadOneBlend(blend[0])
            
        })       

    fetch(`http://localhost:3000/ingredients`)
        .then (r => r.json())
        .then ( ingredients => {
            const ingredientsArray = ingredients.filter( ingredient => parseInt(ingredient.spiceblendId) === blendID).map(ingredient => ingredient.name)
            updateIngredients(ingredientsArray)
        })
}

// Event Listeners //

updateForm.addEventListener('submit', event => {
    event.preventDefault()

    
    const title = event.target.title.value
    const blendUpdate = { title }
    // debugger
    fetch(`http://localhost:3000/spiceblends/${event.target.dataset.id}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(blendUpdate)})
            .then( r => r.json())
            .then( updatedObj => {
                loadOneBlend(updatedObj)
                console.log('UPDATED:', updatedObj)

            })

})

ingredientForm.addEventListener('submit', event => {
    event.preventDefault()
    // debugger
    const name = event.target.name.value 
    const spiceblendId = event.target.dataset.id
    const ingredientUpdate = { name, spiceblendId }


    fetch(`http://localhost:3000/ingredients`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(ingredientUpdate)})
            .then( r => r.json())
            .then( updatedObj => {
                //refactor below? I REALLY GOT STUCK BECAUSE I WROTE inn-her-HTML
                ingredientList.innerHTML = ""
                // debugger
                spotLightedSpice()
                // console.log(ingredientList)
                console.log('UPDATED:', updatedObj)
            })

})

spotLightedSpice()
