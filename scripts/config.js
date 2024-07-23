(function() {
    console.log(window.location.hostname)
    const env = window.location.hostname === '127.0.0.1' ? 'dev' : 'prod';
    fetch(`./config/${env}/config.json`)
        .then(res => res.json())
        .then(config => {
            window.env = config;
        });
})();