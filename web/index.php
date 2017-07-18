<?php
  $assetsBasePath = '';

  $env = getenv( 'NODE_ENV' );
	$host = getenv( 'npm_config_host' );
	$port = (int) getenv( 'npm_config_port' );
	$port += 1;

	if ( isset($env) && $env == 'development' && isset($host) && isset($port) ) {
		$assetsBasePath = 'http://' . $host . ':' . $port;
	}
?><!DOCTYPE html>
<html lang="pl">
<head>
	<meta charset="utf-8">
  <meta name="viewport" content="user-scalable=yes, width=device-width, initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<title>VueJS Starter</title>

	<link rel='stylesheet' type='text/css' href='<?php echo $assetsBasePath; ?>/assets/css/style.css?v=20170314'>

	<script>
		var assetsVersion = '20170314';
	</script>
</head>
<body>

	<div id="app" class="main-wrapper" v-bind:class="'is-page--' + $route.name">
		<header class="main-header">
			<div class="main-header__align">
				<a class="main-header__logo" href="http://stabla.com"><img src="/assets/img/logo-stabla@2x.png" alt="stabla.com"></a>

				<a class="main-header__github" href="https://github.com/tstabla">Follow @tstabla</a>
			</div>
		</header>

		<h1 class="main-title">
			Vue.js Starter
		</h1>

		<nav class="main-menu">
			<ul>
				<li><router-link :to="{name: 'index'}" exact>Home</router-link></li>
				<li><router-link :to="{name: 'subpage-1'}" exact>Page 1</router-link></li>
				<li><router-link to="/subpage/subpage-of-subpage">Page 2</router-link></li>
			</ul>
		</nav>

		<div class="main-content">
			<div class="main-content__wrapper">
				<div class="main-content__inner">
					<transition name="fade-page">
					  <keep-alive>
					    <router-view></router-view>
					  </keep-alive>
					</transition>
				</div>
			</div>
		</div>
	</div>

	<script src="<?php echo $assetsBasePath; ?>/assets/js/app.js?v=20170314"></script>
</body>
</html>