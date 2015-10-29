angular.module('ngBoilerplate.user', [
  'ui.router',
  'ngMessages',
  'satellizer',
  'ngBoilerplate.user.LoginCtrl',
  'ngBoilerplate.user.LogoutCtrl',
  'ngBoilerplate.user.SignupCtrl',
  'ngBoilerplate.user.ConnectCtrl',
  'ngBoilerplate.user.ProfileCtrl',
  'ngBoilerplate.user.UpdateCtrl',
  'ngBoilerplate.user.ConfirmCtrl',
  'ngBoilerplate.user.VerifiedCtrl',
  'ngBoilerplate.user.PasswordResetCtrl',
  'ngBoilerplate.user.PublicUserCtrl',

  // directive
  'ngBoilerplate.user.emailAvailable',
  'ngBoilerplate.user.usernameAvailable',
  'ngBoilerplate.user.passwordStrength',
  'ngBoilerplate.user.passwordMatch',
  'ngBoilerplate.user.formUsable'
])

.config(function config( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.when('/user', '/user/log-in');

  $stateProvider
    .state('user', {
      url: '/user',
      views: {
        "main": {
          templateUrl: 'user/templates/user.tpl.html'
        }
      },
      onExit: function(shell){
        shell.clearReferer();
      },
      data:{ pageTitle: 'User' }
    })

      .state('user.login', {
        url: '/log-in',
        resolve: {
          resA: function(authenticate) {
            return authenticate.islogged();
          },
          go: function(shell) {
            var referer = shell.getReferer();
            return referer != null ? referer : 'user.profile';
          }
        },
        views: {
          "": {
            controller: 'LoginCtrl',
            templateUrl: 'user/templates/user.login.tpl.html'
          },
          'connect@user.login': {
            controller: 'ConnectCtrl',
            templateUrl: 'user/templates/partial/user.connect.tpl.html'
          }
        },
        data:{ pageTitle: 'Sign in' }
      })

      .state('user.logout', {
        url: '/log-out',
        resolve: {
          go: function(shell) {
            var referer = shell.getReferer();
            return referer != null ? referer : 'home';
          }
        },
        views: {
          "": {
            controller: 'LogoutCtrl',
            templateUrl:  null
          },
        },
        data:{ pageTitle: 'Loggin out' }
      })

      .state('user.signup', {
        url: '/sign-up',
        resolve: {
          resA: function(authenticate) {
            return authenticate.islogged();
          },
          go: function(shell) {
            var referer = shell.getReferer();
            return referer != null ? referer : 'user.profile';
          }
        },
        views: {
          "": {
            controller: 'SignupCtrl',
            templateUrl: 'user/templates/user.signup.tpl.html'
          },
          'connect@user.signup': {
            controller: 'ConnectCtrl',
            templateUrl: 'user/templates/partial/user.connect.tpl.html'
          }
        },
        data:{ pageTitle: 'Sign up' }
      })

      .state('user.confirm', {
        url: '/confirm',
        params: {
          email: null
        },
        views: {
          "": {
            controller: 'ConfirmCtrl',
            templateUrl: 'user/templates/user.confirm.tpl.html'
          }
        },
        data: { pageTitle: 'Pending confirmation' }
      })

      .state('user.verified', {
        url: '/verified/:token',
        views: {
          "": {
            controller: 'VerifiedCtrl',
            templateUrl: 'user/templates/user.verified.tpl.html'
          }
        },
        data: { pageTitle: 'Verified' }
      })

      .state('user.update', {
        url: '/update',
        resolve: {
          resA: function(authenticate) {
            return authenticate.islogged();
          },
          go: function(shell) {
            var referer = shell.getReferer();
            return referer != null ? referer : 'user.profile';
          }
        },
        views: {
          "": {
            controller: 'UpdateCtrl',
            templateUrl: 'user/templates/user.update.tpl.html'
          },
        },
        data:{ pageTitle: 'Update info' }
      })

      .state('user.profile', {
        url: '/profile',
        resolve: {
          resA: function(authenticate) {
            return authenticate.islogged();
          }
        },
        views: {
          "": {
            controller: 'ProfileCtrl',
            templateUrl: 'user/templates/user.profile.tpl.html'
          }
        },
        onExit: function($rootScope){
          if ($rootScope.initialUser !== null) {
            $rootScope.user = $rootScope.initialUser;
          }
        },
        data:{
          pageTitle: 'Profile',
          headerSubtitle: 'Your public information'
        }
      })

      .state('user.password_reset', {
        abstract: true,
        url: '/password-reset',
        resolve: {
          resA: function(authenticate) {
            return authenticate.islogged();
          }
        },
        views: {
          "": {
            templateUrl: 'user/templates/user.password-reset.tpl.html',
          }
        },
        data:{
          pageTitle: 'Password reset',
          headerSubtitle: 'This example is a quick exercise to illustrate how,'
        }
      })

        .state('user.password_reset.begin', {
          url: '/begin',
          views: {
            "": {
              controller: 'PasswordResetBeginCtrl',
              templateUrl: 'user/templates/user.password-reset.begin.tpl.html',
            }
          },
        })

        .state('user.password_reset.email_sent', {
          url: '/email-sent',
          params: {
            sent: null
          },
          views: {
            "": {
              controller: 'PasswordResetEmailSentCtrl',
              templateUrl: 'user/templates/user.password-reset.email-sent.tpl.html',
            }
          },
          data: {
            headerTitle: 'Email sent'
          }
        })

        .state('user.password_reset.choose', {
          url: '/choose/:token',
          views: {
            "": {
              controller: 'PasswordResetChooseCtrl',
              templateUrl: 'user/templates/user.password-reset.choose.tpl.html',
            }
          },
           data: {
            pageTitle: 'New - Reset password',
            headerTitle: 'Password reset'
          }
        })

    .state('userpage', {
      url: '/{username}',
      resolve: {
        user: function(User, $stateParams){
          return User.getPublicUser({username: $stateParams.username}).$promise;
        },
        userAll: function(User) {
          return User.all();
        }
      },
      views: {
        "main": {
          controller: 'PublicUserCtrl',
          templateUrl: 'user/templates/user.public.tpl.html'
        }
      },
      data: { pageTitle: 'User' }
    })

  ;

})

.factory('formFactory', function($timeout) {
  return {
    // enableElements: function (element) {
      enableElements: function () {
      // var blurElements = element.querySelectorAll('.js-form-blur');
      var blurElements = document.querySelectorAll('.js-form-blur');

      var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
          callback.call(scope, i, array[i]);
        }
      };

      // $timeout(function(){
      forEach(blurElements, function (index, element) {
        angular.element(element).attr('disabled', false);
        // element.disabled = false;
      });
      // }, 100);
    }
  };
})

// .directive('ngEnter', function () {
//   return function (scope, element, attrs) {
//     element.bind("keydown", function (event) {
//       if(event.which === 13) {
//         // scope.$apply(function (){
//           scope.$eval(attrs.ngEnter);
//         // });

//         event.preventDefault();
//       }
//     });
//   };
// })

;