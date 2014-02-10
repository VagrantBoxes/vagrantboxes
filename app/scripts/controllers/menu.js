// initialize the menu controller to change the 'active' state
angular.module('vagrantlistApp').controller(
    'MenuController',
    function ($scope) {

        /**
         * Index of the current active menu item
         * @type {number}
         */
        $scope.current_active = 0;

        /**
         * Menu items being populated at runtime
         * @type {Array}
         */
        $scope.items = [
            {
                text: "Boxes",
                route: "/",
                active: true
            },
            {
                text: "Suggest a box",
                route: "/suggest",
                active: false
            }
        ];

        /**
         * Change the active state when a menu item is clicked
         * @param index
         */
        $scope.click = function(index) {
            $scope.items[$scope.current_active].active = false;
            $scope.items[index].active = true;
            $scope.current_active = index;
        }
    }
);