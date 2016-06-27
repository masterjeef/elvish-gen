/**
 * Created by Jeff on 6/24/2016.
 */

require("angular");

angular.module('tengwarTranscriber', [])
    .controller('TengwarController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
        var tc = this;

        tc.originalValue = '';
        tc.tengwarResult = '&#83;&#35;&#101;&#58;';

        tc.transcribe = function () {
                console.log(transcriber);

                var quenya = window.tengwarTranscriber.toQuenya(tc.originalValue);

                tc.tengwarResult = quenya;
        };

        $scope.renderHtml = function (html) {
                return $sce.trustAsHtml(html);
        };
}]);
