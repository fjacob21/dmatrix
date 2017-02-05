class Service {
        constructor() {
        }

        isActive() {
                return $.ajax({
                type: 'GET',
                url: "/active" ,
                contentType: "application/json",
                dataType: 'json'
                });
        }

        upload(bitmap) {
                var data = {bitmap: bitmap};
                return $.ajax({
                type: 'POST',
                url: "/upload" ,
                data: JSON.stringify (data),
                contentType: "application/json",
                dataType: 'json'
                });
        }
}

module.exports = Service;
