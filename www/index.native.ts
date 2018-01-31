window.addEventListener('unhandledrejection', function handlUnhandledrejection (event) {
    if(console) {
        console.log(event);
    }
});

function start() {
    console.log("start application");
    //render.render();
    const throwError = true;

 

    later(throwError)
    .then(function handleLater(data: string) {
        // Don't add catch to test unhandled exceptions
    }) ;
}

function later(throwError: boolean) {

    
    return new Promise(function(resolve) {

        
        setTimeout(function() {
            if(throwError) {
                throw new Error("Some error occured.");
            }  
            resolve("theValue");
        }, 200);
    });
}

start();