
const BACKEND = import.meta.env.VITE_BACKEND_URL

async function createStripeProduct(title: string, description: string, price: number) {
    const stripeProduct = {
        name: title,
        description: description,
        price: price,
    }
    const createProductEndpoint = `${BACKEND}/create-product`
    console.log("sending fetch to : ", createProductEndpoint)
    const resp = await fetch(createProductEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stripeProduct)
    })
    if (resp.ok) {
        console.log("Product created successfully")
        const { stripeProductId, stripePriceId } = await resp.json()
        return { stripeProductId, stripePriceId }
    } else {
        console.log("Error creating product: ", resp)
        throw new Error("Error creating stripe product and price")
    }
}

async function editStripeProduct(stripeProductId: string, name: string, description: string, newPrice: number) {
    const stripeProduct = {
        stripeProductId,
        name,
        description,
        newPrice,
    }
    const editProductEndpoint = `${BACKEND}/edit-product`
    console.log("sending fetch to : ", editProductEndpoint)
    const resp = await fetch(editProductEndpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stripeProduct)
    }); if (resp.ok) {
        console.log("Product edited successfully")
        const { stripeProductId, stripePriceId } = await resp.json()
        return { stripeProductId, stripePriceId }
    } else {
        console.log("Error editing Stripe Product/Price: ", resp)
        throw new Error("Error editing stripe product and price")
    }
}


export { createStripeProduct, editStripeProduct }