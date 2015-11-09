angular.module('example', [])
    .controller('IncrementalCtrl', ['$scope', '$document', '$interval', '$timeout',

function ($scope, $document, $interval, $timeout) {
    const startPlayer = {
        money: 0,
        tier: [0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0],
        tierCost: [15,
        100,
        500,
        3000,
        10000,
        40000,
        200000,
        1667000,
        123457000,
        4000000000,
        75000000000],
        tierPower: [1,
        5,
        40,
        100,
        400,
        1000,
        4000,
        66660,
        987650,
        9999990,
        100000000],
        tierUpgrades: [
            [100,
            400,
            10000,
            500000,
            50000000,
            500000000,
            5000000000],
            [1000,
            10000,
            50000,
            100000,
            300000,
            1000000,
            5000000],
            [5000,
            50000,
            500000,
            25000000,
            500000000,
            4000000000000],
            [30000,
            300000,
            3000000,
            150000000,
            3000000000,
            24000000000000],
            [100000,
            1000000,
            10000000,
            500000000,
            10000000000,
            80000000000000],
            [400000,
            4000000,
            40000000,
            2000000000,
            40000000000,
            320000000000000],
            [2000000,
            20000000,
            200000000,
            10000000000,
            200000000000,
            1600000000000000],
            [16667000,
            166667000,
            1667000000,
            83333000000,
            1667000000000,
            13333000000000000],
            [1235000000,
            9877000000,
            98765000000,
            1235000000000,
            123457000000000,
            987654000000000000],
            [40000000000,
            400000000000,
            4000000000000,
            200000000000000,
            4000000000000000,
            32000000000000000000],
            [750000000000,
            7500000000000,
            75000000000000,
            3750000000000000,
            75000000000000000,
            600000000000000000000]
    ]};

    currentCost = null;
    currentUpgrade = null;

    $scope.produceMoney = function () {
        $scope.player.money++;
    }

    $scope.moneyPerSecond = function () {
        var total = 0;
        for (var i = 0; i < $scope.player.tier.length; i++) {
            total += $scope.player.tier[i] * $scope.player.tierPower[i];
        }
        return total;
    }

    $scope.buy = function (level) {
        if ($scope.player.tierCost[level] > $scope.player.money) {
            return;
        }
        $scope.player.tier[level]++;
        $scope.player.money -= $scope.player.tierCost[level];
        $scope.player.tierCost[level] = Math.ceil($scope.player.tierCost[level] * 1.15);
    }

    $scope.buyUpgrade = function (tier, level) {
        if ($scope.player.tierUpgrades[tier][level] > $scope.player.money || $scope.player.tierUpgrades[tier][level] == null) {
            return;
        }
        $scope.player.tierPower[tier] *= 2;
        $scope.player.money -= $scope.player.tierUpgrades[tier][level];
        $scope.player.tierUpgrades[tier][level] = null;
    }

    $scope.showCost = function (index) {
        currentCost = index;
    }

    $scope.hideCost = function () {
        currentCost = null;
    }

    $scope.showUpgradeCost = function (tier, index) {
        currentUpgrade = [tier, index];
    }

    $scope.hideUpgradeCost = function () {
        currentUpgrade = null;
    }

    function init(){
        $scope.player = angular.copy(startPlayer);
        $scope.sprintFinished = false;
    }
    
    	$scope.save = function save() {
			localStorage.setItem("playerStored", JSON.stringify($scope.player));
			var d = new Date();
			$scope.lastSave = d.toLocaleTimeString();
		}
		
		$scope.load = function load() {
			try {
				$scope.player = JSON.parse(localStorage.getItem("playerStored"));
			}catch(err){
				alert("Error loading savegame, reset forced.")
				$scope.reset(false);
			}
		}
		
		$scope.reset = function reset(ask) {
			var confirmation = true;
			if(ask){
				confirmation = confirm("Are you sure you want to retire? This will permanently erase your progress.");
			}
			
			if(confirmation === true){
				init();
				localStorage.removeItem("playerStored");
			}
		}
    
    $timeout(function(){
			if(localStorage.getItem("playerStored") != null){
				$scope.load();
			}
			if(typeof $scope.player  === 'undefined'){
				init();
			}
			if(typeof $scope.lastSave  === 'undefined'){
				$scope.lastSave = "None";
			}
            $interval(update,10);
            $interval($scope.save,10000);
        });
    
    var before = new Date();
    
    // Run UI update code every 10ms
    update = function () {
        now = new Date();
    	var elapsedTime = (now.getTime() - before.getTime());
    	before = now;
        
        var ctx = $document[0].getElementById("canvas").getContext("2d");
        ctx.clearRect(0, 0, 700, 400);

        var ratio = 1;

        var moneyRadius = window.Math.sqrt($scope.player.money / window.Math.PI)

        if (moneyRadius > 90) {
            ratio = 90 / moneyRadius;
            moneyRadius = 90;
        }
        var startingIndex = window.Math.ceil(window.Math.log10($scope.player.money));
        if (startingIndex < 3) {
            startingIndex = 3;
        }
        var milestones = [];
        for (var i = startingIndex; i < startingIndex + 4; i++) {
            milestones.push(window.Math.pow(10, i));
        }
        for (var i in milestones) {
            var milestoneRadius = window.Math.sqrt(milestones[i] / window.Math.PI);
            ctx.fillStyle = "#e67e22";
            ctx.font = "60px";
            ctx.fillText(milestones[i], 350, 200 - milestoneRadius * ratio - 5);
            ctx.setLineDash([5]);
            ctx.strokeStyle = "#e67e22";
            ctx.beginPath();
            ctx.arc(350, 200, milestoneRadius * ratio, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }

        ctx.fillStyle = "#3498db";
        ctx.beginPath();
        ctx.arc(350, 200, moneyRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        var moneyPerSecond = 0;
        
        for (var i = 0; i < $scope.player.tier.length; i++) {
            moneyPerSecond += ($scope.player.tier[i] * $scope.player.tierPower[i]);
        }
        
        var moneyPerSecondRadius = window.Math.sqrt(moneyPerSecond / window.Math.PI)

        ctx.fillStyle = "#9b59b6";
        ctx.beginPath();
        ctx.arc(350, 200, moneyPerSecondRadius*ratio, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = "#e74c3c";
        var costRadius = 0;
        if (currentCost != null) {
            costRadius = window.Math.sqrt($scope.player.tierCost[currentCost] / window.Math.PI)
        }
        ctx.beginPath();
        ctx.arc(350 + moneyRadius + 5 + costRadius * ratio, 200, costRadius * ratio, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#2ecc71";
        var upgradeRadius = 0;
        if (currentUpgrade != null) {
            upgradeRadius = window.Math.sqrt($scope.player.tierUpgrades[currentUpgrade[0]][currentUpgrade[1]] / window.Math.PI)
        }
        ctx.beginPath();
        ctx.arc(350 - moneyRadius - 5 - upgradeRadius * ratio, 200, upgradeRadius * ratio, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        for (var i = 0; i < $scope.player.tier.length; i++) {
            $scope.player.money += ($scope.player.tier[i] * $scope.player.tierPower[i] * elapsedTime/1000);
        }

    };
}]);