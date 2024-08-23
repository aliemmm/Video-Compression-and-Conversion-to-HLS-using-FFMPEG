# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin "etro", to: "https://cdn.jsdelivr.net/npm/etro@0.12.1/dist/etro-cjs.min.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
