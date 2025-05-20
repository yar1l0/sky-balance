 (function () {

    const NativeURL = URL


    window.URL = function (input, base) {
        if (typeof input === 'string' && !base) {
            base = window.location.origin
        }
        return new NativeURL(input, base)
    }


    window.URL.createObjectURL = NativeURL.createObjectURL
    window.URL.revokeObjectURL = NativeURL.revokeObjectURL

    
})()
