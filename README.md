# angular-snow
Let it snow! Use ng-snow to apply fancy JS snow to your elements:

![Angular Snow Demo](angular-snow-demo.gif)

```html
<ng-snow></div>
```

##Installation

**1. Install via bower**:

```sh
bower install angular-snow --save
```

**2. Add Dependencies to your html:**:

```html
<!-- angular-snow dependencies -->
<link href="bower_components/angular-snow/angular-snow.css" rel="stylesheet" type="text/css"/>
<script src="bower_components/angular-snow/angular-snow.js" type="text/javascript"></script>
```

##Custom Image
You can replace the snow by a custom image via the *custom-image* parameter. For Example:
 
```html
<ng-snow flake="grumpy-cat.png"></div>
```

![Angular Snow Demo](angular-snow-custom.gif)

Credits go out to: [this codepen](http://codepen.io/NickyCDK/pen/AIonk)