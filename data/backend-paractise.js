export let products = [];

export function loadProducts() {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("load", () => {
    products = JSON.parse(xhr.response).map((productDetails)=>{
        if(productDetails.type === 'clothing') {
            return new Clothing(productDetails);
        }
        return new Product(productDetails);
    });
    console.log("load Products");
    
  });
  xhr.open("GET",'https://supersimplebackend.dev/products');
  xhr.send();
}
