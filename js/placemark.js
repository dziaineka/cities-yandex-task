var myMap;
ymaps.ready(initMap);

function initMap() {
    myMap = new ymaps.Map("map", {
        center: [53.9, 27.56659],
        zoom: 10
    });
}

function getCityColor() {
    if (mansTurn) {
        return 'islands#redDotIconWithCaption';
    } else {
        return 'islands#greenDotIconWithCaption';
    }
}

function swichToBigScale() {
    // Найдем координаты Минска и покажем его на карте
    // на маленьком уровне масштабирования.
    ymaps.geocode('Минск').then(function (res) {
        var coords = res.geoObjects.get(0).geometry.getCoordinates();
        myMap.zoomRange.get(coords).then(function (range) {
            myMap.setCenter(coords, 2);
        });
    });
}

function addCityToMap(cityName) {
    var colour = getCityColor();
    // Поиск координат центра города.
    ymaps.geocode(cityName, {
        /**
         * Опции запроса
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
         */
        // Если нужен только один результат, экономим трафик пользователей.
        results: 1
    }).then(function (res) {
        // Выбираем первый результат геокодирования.
        var firstGeoObject = res.geoObjects.get(0),
            // Координаты геообъекта.
            coords = firstGeoObject.geometry.getCoordinates(),
            // Область видимости геообъекта.
            bounds = firstGeoObject.properties.get('boundedBy');

        firstGeoObject.options.set('preset', colour);
        // Получаем строку с адресом и выводим в иконке геообъекта.
        firstGeoObject.properties.set('iconCaption', cityName);

        // Добавляем первый найденный геообъект на карту.
        myMap.geoObjects.add(firstGeoObject);
        // Масштабируем карту на область видимости геообъекта.
        myMap.setBounds(bounds, {
            // Проверяем наличие тайлов на данном масштабе.
            checkZoomRange: true
        });
    });
}