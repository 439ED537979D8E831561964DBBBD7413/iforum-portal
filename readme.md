
Quick Start

    Download the latest Theme source from ThemeForest.
    Download and install Node.js from nodejs.org/en/download/
    Start command prompt window or terminal and change directory to [root]/tools/

    cd theme/angular/tools

    cd theme/default/tools

    Install the latest version of npm.

    npm install --global npm@latest

    Install the latest version of yarn.

    npm install --global yarn

    Install gulp.

    npm install --global gulp-cli

    Install yarn dependencies. Must execute in [root]/tools/ folder.

    yarn install

    Compile scss and javascript using gulp. You need to run this command everytime scripts under [root]/src has been changed. This command must execute in the [root]/tools folder.

    gulp --prod

    Run Angular application

    cd [root]/dist/demo/[demo_id]

    npm install

    ng serve

    Default static HTML location

    cd [root]/dist/demo/[demo_id]


Files Structure
Overview
Metronic comes with a flexible file structure that can be easily used for small to large scope projects. This section will explain Metronic's entire file structure and how to adapt it to your project.

[root] is refers to the package type version.

    default is the default version based on HTML, jQuery and Bootstrap
    angular is the Angular integrated hybrid version built on top of the default version with Angular-CLI

Path 	Description
dist 	Theme versions folder
docs 	The theme documentation
.. 	Demo contents
src 	Src(stands for source) contains the raw source code of javascript, scss, images and web font files that will be minified/concatenated onto assets folder for production usage
js 	Javascript source files
media 	Media(image, video, font files, etc) files
sass 	Sass source files
vendors 	3rd party libraries
tools 	Development and deployment tools
gulp 	The build tools gulp tasks for bundle and minify the js and css files and complile sass files.
node_modules 	NPM package installation folder
[version_package].json 	Metronic build config file. Depends on which version package, either default or angular. Here you can configure the build according to your requirements
gulpfile.json 	Gulp tasks main script. All the build tool tasks are grouped in this script
package.json 	NPM package manager config file
.. 	Another version package
Javascript
Below table explains Metronic javascript file structure. Is it located based on which version package, either defult or angular. The table below start with the path: [root]/src/
Path 	Description
src 	Src(stands for source) contains the raw source code of javascript, scss, images and web font files that will be minified/concatenated onto assets folder for production usage
js 	Javascript files
app 	Application level(global) javascript files
base 	Application level base javascript files are minified and concatenated into the base bundle assets/demo/[demo_id]/base/scripts.bundle.js to be included globally. demo_id is the selected demo name.
custom 	Application level custom javascript files are minified and moved to assets/app/js/* to be included on demand.
demo 	Demo level javascript files
default 	Default demo javascript files
base 	Demo level base javascript files are minified and concatenated into the base bundle assets/demo/[demo_id]/base/scripts.bundle.js to be included globally. demo_id is the selected demo name.
custom 	Demo level custom javascript files are minified and moved to assets/demo/[demo_id]/custom/* to be included on demand. demo_id is the selected demo name.
... 	Other demos
framework 	Framework components javascript files are minified and concatenated into the base bundle assets/demo/[demo_id]/base/scripts.bundle.js to be included globally. demo_id is the selected demo name.
snippets 	Snippets are custom templates created for certain requirements by customizing and extending the theme's base components and plugins
base 	Base snippets javascript files are minified and concatenated into the base bundle assets/demo/[demo_id]/base/scripts.bundle.js to be included globally. demo_id is the selected demo name.
custom 	Application level custom javascript files are minified and moved to assets/snippets/* to be included on demand.
SASS
Below table explains Metronic SASS file structure. Is it located based on which version package, either defult or angular. The table below start with the path: [root]/src/
Path 	Description
src 	Src(stands for source) contains the raw source code of javascript, scss, images and web font files that will be minified/concatenated onto assets folder for production usage
sass 	Javascript files
demo 	Demo level sass files
default 	Default demo sass files
style.css 	style.scss is compiled, minified and concatenated into the base bundle stylesheet assets/demo/[demo_id]/base/style.bundle.css to be included globally. demo_id is the selected demo name.
... 	Other demos
framework 	Framework scss files are compiled, minified and concatenated into the base bundle assets/demo/[demo_id]/base/style.bundle.css to be included globally. demo_id is the selected demo name.
snippets 	Snippets sass files are compiled, minified and concatenated into the base bundle assets/demo/[demo_id]/base/style.bundle.css to be included globally. demo_id is the selected demo name.
custom 	Application level custom javascript files are minified and moved to assets/snippets/* to be included on demand.
Build Tools
Overview

Metronic build tools provides easy package management and production deployment for any type of web application that also comes with powerful asset bundle tools to organize assets structure with custom bundling for production.

Metronic's central default.json and angular.json build config files allows you manage the entire assest bundling for production by taking advantage of yarn package manager.
Build Config

The build config file is located at [root]/tools/conf/[version_package].json and you can fully customize the build settings to meet your project requirements:

Please make sure the dist output path config.dist is set to true in default.json and angular.json, for the build tools to output the compilation.

{
    "config": {
        "demo": "",
        "debug": false,
        "compile": {
            "jsUglify": false,
            "cssMinify": false,
            "jsSourcemaps": false,
            "cssSourcemaps": false
        },
        "path": {
            "src": "./../theme/[root]/src",
            "node_modules": "./node_modules",
            "demo_api_url": "https://keenthemes.com/metronic/preview/"
        },
        "dist": [
            "./../theme/dist/preview/assets",
            "./../theme/dist/default/**/assets"
        ]
    },
    "build": {
        "vendors": {
            "base": {
                "src": {
                    "mandatory": {
                        "jquery": {
                            "scripts": [
                                "{$config.path.node_modules}/jquery/dist/jquery.js"
                            ]
                        },
                        "bootstrap": {
                            "scripts": [
                                "{$config.path.node_modules}/popper.js/dist/umd/popper.js",
                                "{$config.path.node_modules}/bootstrap/dist/js/bootstrap.min.js"
                            ]
                        },
                        "js-cookie": {
                            "scripts": [
                                "{$config.path.node_modules}/js-cookie/src/js.cookie.js"
                            ]
                        },
                        "jquery-smooth-scroll": {
                            "scripts": [
                                "{$config.path.node_modules}/jquery-smooth-scroll/jquery.smooth-scroll.js"
                            ]
                        },
                        "moment": {
                            "scripts": [
                                "{$config.path.node_modules}/moment/min/moment.min.js"
                            ]
                        },
                        "wNumb": {
                            "scripts": [
                                "{$config.path.node_modules}/wnumb/wNumb.js"
                            ]
                        }
                    },
                    "optional": {
                        "jquery.repeater": {
                            "scripts": [
                                "{$config.path.node_modules}/jquery.repeater/src/intro.js",
                                "{$config.path.node_modules}/jquery.repeater/src/lib.js",
                                "{$config.path.node_modules}/jquery.repeater/src/jquery.input.js",
                                "{$config.path.node_modules}/jquery.repeater/src/repeater.js",
                                "{$config.path.node_modules}/jquery.repeater/src/outro.js"
                            ]
                        },
                        "jquery-form": {
                            "scripts": [
                                "{$config.path.node_modules}/jquery-form/dist/jquery.form.min.js"
                            ]
                        },
                        "tether": {
                            "styles": [
                                "{$config.path.node_modules}/tether/dist/css/tether.css"
                            ],
                            "scripts": []
                        },
                        "malihu-custom-scrollbar-plugin": {
                            "styles": [
                                "{$config.path.node_modules}/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js"
                            ],
                            "images": [
                                "{$config.path.node_modules}/malihu-custom-scrollbar-plugin/mCSB_buttons.png"
                            ]
                        },
                        "block-ui": {
                            "scripts": [
                                "{$config.path.node_modules}/block-ui/jquery.blockUI.js"
                            ]
                        },
                        "bootstrap-datepicker": {
                            "styles": [
                                "{$config.path.node_modules}/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"
                            ]
                        },
                        "bootstrap-datetime-picker": {
                            "styles": [
                                "{$config.path.node_modules}/bootstrap-datetime-picker/css/bootstrap-datetimepicker.min.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/bootstrap-datetime-picker/js/bootstrap-datetimepicker.min.js"
                            ]
                        },
                        "bootstrap-timepicker": {
                            "styles": [
                                "{$config.path.node_modules}/bootstrap-timepicker/css/bootstrap-timepicker.min.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/bootstrap-timepicker/js/bootstrap-timepicker.min.js",
                                "{$config.path.src}/js/framework/components/plugins/forms/bootstrap-timepicker.init.js"
                            ]
                        },
                        "bootstrap-daterangepicker": {
                            "styles": [
                                "{$config.path.node_modules}/bootstrap-daterangepicker/daterangepicker.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/bootstrap-daterangepicker/daterangepicker.js",
                                "{$config.path.src}/js/framework/components/plugins/forms/bootstrap-daterangepicker.init.js"
                            ]
                        },
                        "bootstrap-touchspin": {
                            "styles": [
                                "{$config.path.node_modules}/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.js"
                            ]
                        },
                        "bootstrap-maxlength": {
                            "scripts": [
                                "{$config.path.node_modules}/bootstrap-maxlength/src/bootstrap-maxlength.js"
                            ]
                        },
                        "bootstrap-switch": {
                            "styles": [
                                "{$config.path.node_modules}/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/bootstrap-switch/dist/js/bootstrap-switch.js",
                                "{$config.path.src}/js/framework/components/plugins/forms/bootstrap-switch.init.js"
                            ]
                        },
                        "bootstrap-multiselectsplitter": {
                            "scripts": [
                                "{$config.path.src}/vendors/bootstrap-multiselectsplitter/bootstrap-multiselectsplitter.min.js"
                            ]
                        },
                        "bootstrap-select": {
                            "styles": [
                                "{$config.path.node_modules}/bootstrap-select/dist/css/bootstrap-select.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/bootstrap-select/dist/js/bootstrap-select.js"
                            ]
                        },
                        "select2": {
                            "styles": [
                                "{$config.path.node_modules}/select2/dist/css/select2.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/select2/dist/js/select2.js"
                            ]
                        },
                        "typeahead.js": {
                            "scripts": [
                                "{$config.path.node_modules}/typeahead.js/dist/typeahead.bundle.js",
                                "{$config.path.node_modules}/handlebars/dist/handlebars.js"
                            ]
                        },
                        "inputmask": {
                            "scripts": [
                                "{$config.path.node_modules}/inputmask/dist/jquery.inputmask.bundle.js",
                                "{$config.path.node_modules}/inputmask/dist/inputmask/inputmask.date.extensions.js",
                                "{$config.path.node_modules}/inputmask/dist/inputmask/inputmask.numeric.extensions.js",
                                "{$config.path.node_modules}/inputmask/dist/inputmask/inputmask.phone.extensions.js"
                            ]
                        },
                        "nouislider": {
                            "styles": [
                                "{$config.path.node_modules}/nouislider/distribute/nouislider.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/nouislider/distribute/nouislider.js"
                            ]
                        },
                        "autosize": {
                            "scripts": [
                                "{$config.path.node_modules}/autosize/dist/autosize.js"
                            ]
                        },
                        "clipboard": {
                            "scripts": [
                                "{$config.path.node_modules}/clipboard/dist/clipboard.min.js"
                            ]
                        },
                        "ion-rangeslider": {
                            "styles": [
                                "{$config.path.node_modules}/ion-rangeslider/css/ion.rangeSlider.css",
                                "{$config.path.node_modules}/ion-rangeslider/css/ion.rangeSlider.skinFlat.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/ion-rangeslider/js/ion.rangeSlider.js"
                            ],
                            "images": [
                                "{$config.path.node_modules}/ion-rangeslider/img/sprite-skin-flat.png"
                            ]
                        },
                        "dropzone": {
                            "styles": [
                                "{$config.path.node_modules}/dropzone/dist/dropzone.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/dropzone/dist/dropzone.js"
                            ]
                        },
                        "summernote": {
                            "styles": [
                                "{$config.path.node_modules}/summernote/dist/summernote.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/summernote/dist/summernote.js"
                            ],
                            "fonts": [
                                "{$config.path.node_modules}/summernote/dist/font/**"
                            ]
                        },
                        "bootstrap-makrdown": {
                            "styles": [
                                "{$config.path.node_modules}/bootstrap-markdown/css/bootstrap-markdown.min.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/bootstrap-markdown/js/bootstrap-markdown.js",
                                "{$config.path.src}/js/framework/components/plugins/forms/bootstrap-markdown.init.js"
                            ]
                        },
                        "jquery-validation": {
                            "scripts": [
                                "{$config.path.node_modules}/jquery-validation/dist/jquery.validate.js",
                                "{$config.path.node_modules}/jquery-validation/dist/additional-methods.js",
                                "{$config.path.src}/js/framework/components/plugins/forms/jquery-validation.init.js"
                            ]
                        },
                        "remarkable-bootstrap-notify": {
                            "scripts": [
                                "{$config.path.node_modules}/bootstrap-notify/bootstrap-notify.min.js",
                                "{$config.path.src}/js/framework/components/plugins/base/bootstrap-notify.init.js"
                            ]
                        },
                        "animate.css": {
                            "styles": [
                                "{$config.path.node_modules}/animate.css/animate.min.css"
                            ]
                        },
                        "toastr": {
                            "styles": [
                                "{$config.path.node_modules}/toastr/build/toastr.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/toastr/build/toastr.min.js"
                            ]
                        },
                        "jstree": {
                            "styles": [
                                "{$config.path.node_modules}/jstree/dist/themes/default/style.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/jstree/dist/jstree.js"
                            ],
                            "images": [
                                "{$config.path.src}/vendors/jstree/32px.png",
                                "{$config.path.node_modules}/jstree/dist/themes/default/40px.png",
                                "{$config.path.node_modules}/jstree/dist/themes/default/*.gif"
                            ]
                        },
                        "morris.js": {
                            "styles": [
                                "{$config.path.node_modules}/morris.js/morris.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/raphael/raphael.js",
                                "{$config.path.node_modules}/morris.js/morris.js"
                            ]
                        },
                        "chartist": {
                            "styles": [
                                "{$config.path.node_modules}/chartist/dist/chartist.css"
                            ],
                            "scripts": [
                                "{$config.path.node_modules}/chartist/dist/chartist.js"
                            ]
                        },
                        "chart.js": {
                            "scripts": [
                                "{$config.path.node_modules}/chart.js/dist/Chart.bundle.js",
                                "{$config.path.src}/js/framework/components/plugins/charts/chart.init.js"
                            ]
                        },
                        "bootstrap-session-timeout": {
                            "scripts": [
                                "{$config.path.src}/vendors/bootstrap-session-timeout/bootstrap-session-timeout.min.js"
                            ]
                        },
                        "jquery-idletimer": {
                            "scripts": [
                                "{$config.path.src}/vendors/jquery-idletimer/idle-timer.min.js"
                            ]
                        },
                        "counterup": {
                            "scripts": [
                                "{$config.path.node_modules}/waypoints/lib/jquery.waypoints.js",
                                "{$config.path.node_modules}/counterup/jquery.counterup.js"
                            ]
                        },
                        "socicon": {
                            "styles": [
                                "{$config.path.node_modules}/socicon/css/socicon.css"
                            ],
                            "fonts": [
                                "{$config.path.node_modules}/socicon/font/**"
                            ]
                        },
                        "font-awesome": {
                            "styles": [
                                "{$config.path.node_modules}/font-awesome/css/font-awesome.css"
                            ],
                            "fonts": [
                                "{$config.path.node_modules}/font-awesome/fonts/**"
                            ]
                        },
                        "line-awesome": {
                            "styles": [
                                "{$config.path.src}/vendors/line-awesome/css/line-awesome.css"
                            ],
                            "fonts": [
                                "{$config.path.src}/vendors/line-awesome/fonts/**"
                            ]
                        },
                        "flaticon": {
                            "styles": [
                                "{$config.path.src}/vendors/flaticon/css/flaticon.css"
                            ],
                            "fonts": [
                                "{$config.path.src}/vendors/flaticon/fonts/**"
                            ]
                        },
                        "metronic": {
                            "styles": [
                                "{$config.path.src}/vendors/metronic/css/styles.css"
                            ],
                            "fonts": [
                                "{$config.path.src}/vendors/metronic/fonts/**"
                            ]
                        }
                    }
                },
                "bundle": {
                    "styles": "{$config.output}/vendors/base/vendors.bundle.css",
                    "scripts": "{$config.output}/vendors/base/vendors.bundle.js",
                    "images": "{$config.output}/vendors/base/images",
                    "fonts": "{$config.output}/vendors/base/fonts"
                }
            },
            "custom": {
                "jquery-ui": {
                    "src": {
                        "styles": [
                            "{$config.path.src}/vendors/jquery-ui/jquery-ui.min.css"
                        ],
                        "scripts": [
                            "{$config.path.src}/vendors/jquery-ui/jquery-ui.min.js"
                        ]
                    },
                    "bundle": {
                        "styles": "{$config.output}/vendors/custom/jquery-ui/jquery-ui.bundle.css",
                        "scripts": "{$config.output}/vendors/custom/jquery-ui/jquery-ui.bundle.js"
                    }
                },
                "fullcalendar": {
                    "src": {
                        "styles": [
                            "{$config.path.node_modules}/fullcalendar/dist/fullcalendar.css"
                        ],
                        "scripts": [
                            "{$config.path.node_modules}/fullcalendar/dist/fullcalendar.js",
                            "{$config.path.node_modules}/fullcalendar/dist/gcal.js"
                        ]
                    },
                    "bundle": {
                        "styles": "{$config.output}/vendors/custom/fullcalendar/fullcalendar.bundle.css",
                        "scripts": "{$config.output}/vendors/custom/fullcalendar/fullcalendar.bundle.js"
                    }
                },
                "gmaps": {
                    "src": {
                        "scripts": [
                            "{$config.path.node_modules}/gmaps/gmaps.js"
                        ]
                    },
                    "bundle": {
                        "scripts": "{$config.output}/vendors/custom/gmaps/gmaps.js"
                    }
                },
                "jqvmap": {
                    "src": {
                        "styles": [
                            "{$config.path.node_modules}/jqvmap/dist/jqvmap.css"
                        ],
                        "scripts": [
                            "{$config.path.node_modules}/jqvmap/dist/jquery.vmap.js",
                            "{$config.path.node_modules}/jqvmap/dist/maps/jquery.vmap.europe.js",
                            "{$config.path.node_modules}/jqvmap/dist/maps/jquery.vmap.germany.js",
                            "{$config.path.node_modules}/jqvmap/dist/maps/jquery.vmap.russia.js",
                            "{$config.path.node_modules}/jqvmap/dist/maps/jquery.vmap.usa.js",
                            "{$config.path.node_modules}/jqvmap/dist/maps/jquery.vmap.world.js"
                        ]
                    },
                    "bundle": {
                        "styles": "{$config.output}/vendors/custom/jqvmap/jqvmap.bundle.css",
                        "scripts": "{$config.output}/vendors/custom/jqvmap/jqvmap.bundle.js"
                    }
                },
                "flot": {
                    "src": {
                        "scripts": [
                            "{$config.path.node_modules}/Flot/jquery.flot.js",
                            "{$config.path.node_modules}/Flot/jquery.flot.resize.js",
                            "{$config.path.node_modules}/Flot/jquery.flot.categories.js",
                            "{$config.path.node_modules}/Flot/jquery.flot.pie.js",
                            "{$config.path.node_modules}/Flot/jquery.flot.stack.js",
                            "{$config.path.node_modules}/Flot/jquery.flot.crosshair.js",
                            "{$config.path.node_modules}/Flot/jquery.flot.axislabels.js"
                        ]
                    },
                    "bundle": {
                        "scripts": "{$config.output}/vendors/custom/flot/flot.bundle.js"
                    }
                }
            }
        },
        "demo": {
            "default": {
                "base": {
                    "src": {
                        "styles": [
                            "{$config.path.src}/sass/demo/default/style.scss"
                        ],
                        "scripts": [
                            "{$config.path.src}/js/framework/**/*.js",
                            "{$config.path.src}/js/demo/default/base/**/*.js",
                            "{$config.path.src}/js/app/base/**/*.js",
                            "{$config.path.src}/js/snippets/base/**/*.js"
                        ]
                    },
                    "bundle": {
                        "styles": "{$config.output}/demo/default/base/style.bundle.css",
                        "scripts": "{$config.output}/demo/default/base/scripts.bundle.js"
                    }
                },
                "custom": {
                    "src": {
                        "scripts": [
                            "{$config.path.src}/js/demo/default/custom/**/*.js"
                        ],
                        "media": [
                            "{$config.path.src}/media/demo/default/**/*.*"
                        ]
                    },
                    "output": {
                        "scripts": "{$config.output}/demo/default/custom/",
                        "media": "{$config.output}/demo/default/media/"
                    }
                }
            },
            "demo2": {
                "base": {
                    "src": {
                        "styles": [
                            "{$config.path.src}/sass/demo/demo2/style.scss"
                        ],
                        "scripts": [
                            "{$config.path.src}/js/framework/**/*.js",
                            "{$config.path.src}/js/demo/demo2/base/**/*.js",
                            "{$config.path.src}/js/app/base/**/*.js",
                            "{$config.path.src}/js/snippets/base/**/*.js"
                        ]
                    },
                    "bundle": {
                        "styles": "{$config.output}/demo/demo2/base/style.bundle.css",
                        "scripts": "{$config.output}/demo/demo2/base/scripts.bundle.js"
                    }
                },
                "custom": {
                    "src": {
                        "scripts": [
                            "{$config.path.src}/js/demo/demo2/custom/**/*.js"
                        ],
                        "media": [
                            "{$config.path.src}/media/demo/demo2/**/*.*"
                        ]
                    },
                    "output": {
                        "scripts": "{$config.output}/demo/demo2/custom/",
                        "media": "{$config.output}/demo/demo2/media/"
                    }
                }
            },
            "demo3": {
                "base": {
                    "src": {
                        "styles": [
                            "{$config.path.src}/sass/demo/demo3/style.scss"
                        ],
                        "scripts": [
                            "{$config.path.src}/js/framework/**/*.js",
                            "{$config.path.src}/js/demo/demo3/base/**/*.js",
                            "{$config.path.src}/js/app/base/**/*.js",
                            "{$config.path.src}/js/snippets/base/**/*.js"
                        ]
                    },
                    "bundle": {
                        "styles": "{$config.output}/demo/demo3/base/style.bundle.css",
                        "scripts": "{$config.output}/demo/demo3/base/scripts.bundle.js"
                    }
                },
                "custom": {
                    "src": {
                        "scripts": [
                            "{$config.path.src}/js/demo/demo3/custom/**/*.js"
                        ],
                        "media": [
                            "{$config.path.src}/media/demo/demo3/**/*.*"
                        ]
                    },
                    "output": {
                        "scripts": "{$config.output}/demo/demo3/custom/",
                        "media": "{$config.output}/demo/demo3/media/"
                    }
                }
            },
            "demo4": {
                "base": {
                    "src": {
                        "styles": [
                            "{$config.path.src}/sass/demo/demo4/style.scss"
                        ],
                        "scripts": [
                            "{$config.path.src}/js/framework/**/*.js",
                            "{$config.path.src}/js/demo/demo4/base/**/*.js",
                            "{$config.path.src}/js/app/base/**/*.js",
                            "{$config.path.src}/js/snippets/base/**/*.js"
                        ]
                    },
                    "bundle": {
                        "styles": "{$config.output}/demo/demo4/base/style.bundle.css",
                        "scripts": "{$config.output}/demo/demo4/base/scripts.bundle.js"
                    }
                },
                "custom": {
                    "src": {
                        "scripts": [
                            "{$config.path.src}/js/demo/demo4/custom/**/*.js"
                        ],
                        "media": [
                            "{$config.path.src}/media/demo/demo4/**/*.*"
                        ]
                    },
                    "output": {
                        "scripts": "{$config.output}/demo/demo4/custom/",
                        "media": "{$config.output}/demo/demo4/media/"
                    }
                }
            },
            "demo5": {
                "base": {
                    "src": {
                        "styles": [
                            "{$config.path.src}/sass/demo/demo5/style.scss"
                        ],
                        "scripts": [
                            "{$config.path.src}/js/framework/**/*.js",
                            "{$config.path.src}/js/demo/demo5/base/**/*.js",
                            "{$config.path.src}/js/app/base/**/*.js",
                            "{$config.path.src}/js/snippets/base/**/*.js"
                        ]
                    },
                    "bundle": {
                        "styles": "{$config.output}/demo/demo5/base/style.bundle.css",
                        "scripts": "{$config.output}/demo/demo5/base/scripts.bundle.js"
                    }
                },
                "custom": {
                    "src": {
                        "scripts": [
                            "{$config.path.src}/js/demo/demo5/custom/**/*.js"
                        ],
                        "media": [
                            "{$config.path.src}/media/demo/demo5/**/*.*"
                        ]
                    },
                    "output": {
                        "scripts": "{$config.output}/demo/demo5/custom/",
                        "media": "{$config.output}/demo/demo5/media/"
                    }
                }
            },
            "demo6": {
                "base": {
                    "src": {
                        "styles": [
                            "{$config.path.src}/sass/demo/demo6/style.scss"
                        ],
                        "scripts": [
                            "{$config.path.src}/js/framework/**/*.js",
                            "{$config.path.src}/js/demo/demo6/base/**/*.js",
                            "{$config.path.src}/js/app/base/**/*.js",
                            "{$config.path.src}/js/snippets/base/**/*.js"
                        ]
                    },
                    "bundle": {
                        "styles": "{$config.output}/demo/demo6/base/style.bundle.css",
                        "scripts": "{$config.output}/demo/demo6/base/scripts.bundle.js"
                    }
                },
                "custom": {
                    "src": {
                        "scripts": [
                            "{$config.path.src}/js/demo/demo6/custom/**/*.js"
                        ],
                        "media": [
                            "{$config.path.src}/media/demo/demo6/**/*.*"
                        ]
                    },
                    "output": {
                        "scripts": "{$config.output}/demo/demo6/custom/",
                        "media": "{$config.output}/demo/demo6/media/"
                    }
                }
            }
        },
        "snippets": {
            "src": {
                "scripts": [
                    "{$config.path.src}/js/snippets/custom/**/*.js"
                ]
            },
            "output": {
                "scripts": "{$config.output}/snippets/"
            }
        },
        "app": {
            "src": {
                "scripts": [
                    "{$config.path.src}/js/app/custom/**/*.js"
                ],
                "media": [
                    "{$config.path.src}/media/app/**/*.*"
                ]
            },
            "output": {
                "scripts": "{$config.output}/app/js",
                "media": "{$config.output}/app/media"
            }
        }
    }
}

Required Core CSS and JS files

Vendors list under build.vendors.base.src.mandatory is required, and the build.vendors.base.src.optional is optional. Also JS & CSS files in demo.[demo_id]* is required for specific demo styles and scripts.

* [demo_id] is the unique demo name, like default, demo2, demo3, etc.

Under snippets and app nodes are for preview demo and optional.
Build Config
Field 	Type 	Description
config.demo 	string 	Specify an ID of the selected demo for gulp tool to build assets only for selected demo
config.debug 	boolean 	Enable/disable debug console log.
config.compile.jsUglify 	boolean 	Enable/disable output Javascript minify.
config.compile.cssMinify 	boolean 	Enable/disable output CSS minify.
config.compile.jsSourcemaps 	boolean 	Enable/disable output Javascript with sourcemaps.
config.compile.cssSourcemaps 	boolean 	Enable/disable output CSS with sourcemaps.
config.path 	object 	Predefined paths the where src/, node_modules/ and theme/[root]/src/ are located. demo_api_url is the ajax API path used by datatables, dropdowns with live search and other json server side data source related demos.
config.dist 	object 	dist stands for distributable and refers to the directories where the minified and bundled assets will be stored for production uses.
Build Items
build.vendors 	object 	vendors object specifies all 3rd party resources to be deployed to assets/vendors/ folder for production usage
build.vendors.base 	object 	This object specifies global 3rd party resources to be added into the base css and js vendors bundles assets/vendors/base/vendors.bundle.js and assets/vendors/base/vendors.bundle.css

The 3rd party plugin images or font files also will be deployed into assets/vendors/base/images and assets/vendors/base/fonts
build.vendors.custom 	object 	This object specifies 3rd party resources that are includable on demand from assets/vendors/custom/ folder
build.demo.default 	object 	Default demo assets
build.demo.default.base 	object 	This object specifies the global assets of the demo to be added into the base css and js demo bundles assets/demo/default/base/scripts.bundle.js and assets/demo/default/base/styles.bundle.css

The media(e.g: images) of the demo are deployed into assets/demo/default/media
build.demo.default.custom 	object 	This object specifies custom assets that are includable on demand from assets/demo/default/custom/ folder
build.snippets 	object 	This object specifies snippets assets that are includable on demand from assets/snippets/ folder
build.app 	object 	This object specifies application level global assets that are includable on demand from assets/app/ folder. Useful if you want to add custom scripts that are used in some spesific pages only.
Tasks

Please update the Node.js, global npm and yarn to the latest version, if you got the error related to the node-sass.

Make sure that before running below tasks the demo parameter in [root]/tools/conf/[version_package].json is set to your current selected demo id (e.g: default, demo2, demo8 or demo12).
Leave the demo parameter empty to build for all demos.
Please set config.path.demo_api_url parameter in [root]/tools/conf/[version_package].json URL to your installed localhost API.

Launch your terminal and change its current directory to the project's tools folder where the build files are located. All commands below must be run in this tools folder.

cd [root]/tools/

For the first time launch, run the command below to install the npm dependencies defined in [root]/tools/package.json (if you haven't done already) :

yarn install

For the first time or after every modification in [root]/src/, run below task to compile the assets as defined in [root]/tools/conf/[version_package].json :

gulp

Provide argument --prod to build assets with JS and CSS minify enabled.

gulp --prod

Run below task to update server side ajax demo API URL fix (required fix for angular and html versions) as defined in config.path.demo_api_url right after gulp task completed:

gulp apiurl

In some cases, if the Angular demo folder was moved to other directories, gulp command may not work. Please use gulp command with flag --angular-jquery for the assets compilation.

gulp --prod --angular-jquery

For the Metronic v5.1 and older version, please use this instead.

gulp --prod --angular

Base theme CSS & JS in [root]/src/. When you run gulp, all CSS & JS from [root]/src/ will be compiled and place into several demo locations, for Angular and HTML static. The compile output folder is defined in [root]/tools/conf/[version_package].json file, under config.dist. You can create another compile output path.

"dist": [
    "./../theme/dist/preview/assets",
    "./../theme/dist/default/**/assets"
]

Gulp can run automatically when a file changed. Watch tasks file is located in [root]/tools/gulp/watch.js.

To run watcher for all JS and CSS files. Run command below.

gulp watch

You also can run watcher separately for JS and CSS.

gulp watch:js

gulp watch:scss

