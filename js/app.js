/**
 * Created by Jeff on 6/24/2016.
 */

require("angular");



angular.module('tengwarTranscriber', [])
    .controller('TengwarController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
        var tc = this;

        tc.originalValue = '';
        tc.tengwarResult = '';

        console.log(transcriber); // <-- why do I need this? This is bad. ):

        var vowels = window.tengwarTranscriber.vowels();
        console.log(vowels);
        tc.tengwarVowels = vowels;

        tc.transcribe = function () {
                var quenya = window.tengwarTranscriber.toQuenya(tc.originalValue);
                
                tc.tengwarResult = quenya;
        };

        $scope.renderHtml = function (html) {
                return $sce.trustAsHtml(html);
        };
}]);
