import { Controller } from "@hotwired/stimulus"

let movie
let videoLayer
export default class extends Controller {
    static targets = ["input", "fillColorField", "stokeColorField"];

    connect() {
        this.fillColorFieldTarget.addEventListener('input', this.add_text.bind(this));
        this.stokeColorFieldTarget.addEventListener('input', this.add_text.bind(this));
        $('#font_size, #font_family, #stroke_position').select2({
            placeholder: 'Select Size'
        }).on('select2:select', (e) => {
            this.add_text();
        });
    }

    disconnect() {
        this.fillColorFieldTarget.removeEventListener('input', this.add_text.bind(this));
        this.stokeColorFieldTarget.removeEventListener('input', this.add_text.bind(this));
    }

    open_editor() {
        document.getElementById('loader').classList.remove('hidden')
        var files = this.inputTarget.files;
        var video = files[0]
        var reader = new FileReader();
        reader.onload = async function(fileEvent) {
            const fileResult = fileEvent.target.result;
            document.getElementById('video-editor').style.display = 'flex';
            document.getElementById('editor_overlay').style.display = 'block';

            const canvas = document.createElement('canvas');
            canvas.classList.add('w-full', 'h-full', 'rounded-lg');
            canvas.setAttribute('id', 'editorCanvas')
            document.getElementById('editor').appendChild(canvas);

            let ctx = canvas.getContext("2d");
            const video = document.createElement('video');
            video.src = fileResult;
            video.preload = 'auto';
            video.crossOrigin = 'anonymous';

            video.addEventListener('loadedmetadata', () => {canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                movie = new window.etro.Movie({
                    canvas: canvas
                });
                videoLayer = new window.etro.layer.Video({
                    startTime: 0,
                    source: fileResult
                });
                movie.layers.push(videoLayer);

                function showStream (stream) {
                    const video = document.createElement('video')
                    video.srcObject = stream
                    video.autoplay = true
                    document.body.appendChild(video)
                }
                document.getElementById('editor_modal_content').classList.remove('hidden')
                document.getElementById('loader').classList.add('hidden')

                movie.play({
                    onStart: () => {
                        document.getElementById('editor_modal_content').classList.remove('hidden')
                        document.getElementById('loader').classList.add('hidden')
                        setTimeout(function () {
                            movie.pause()
                        }, 500)
                    }
                }).then(() => {
                }).catch((error) => {
                    console.error('Streaming error:', error);
                });
            });
        };

        reader.readAsDataURL(video);
    }

    pause_video() {
        movie.pause()
    }

    play_video() {
        movie.play()
    }

    close_brand_drawer() {
        document.querySelectorAll('#checkbox:checked').forEach(checkbox => checkbox.checked = false);
        document.getElementById('drawer-brand').style.display = 'none'
    }

    open_text_fields() {
        document.getElementById('filter_layer').classList.add('hidden')
        document.getElementById('filter_layer').classList.remove('show')
        document.getElementById('text-layer').classList.remove('hidden')
        document.getElementById('text-layer').classList.add('show')
    }

    open_effects_view() {
        document.getElementById('text-layer').classList.add('hidden')
        document.getElementById('text-layer').classList.remove('show')
        document.getElementById('filter_layer').classList.remove('hidden')
        document.getElementById('filter_layer').classList.add('show')
    }

    add_text () {
        var inputValue = document.getElementById('text_field').value
        var color = document.getElementById('fill_color_field').value
        var strokeColor = document.getElementById('stroke_color_field').value
        var x = document.getElementById('x_field').value
        var y = document.getElementById('y_field').value
        var fontSize = $('#font_size').val()
        var fontFamily = $('#font_family').val()
        var strokePosition = $('#stroke_position').val()
        if(inputValue) {
            const textlayer = new window.etro.layer.Text({
                startTime: 0,
                duration: 60,
                text: inputValue,
                textX: x ? x : 50,
                textY: y ? y : 50,
                opacity: 1,
                color: window.etro.parseColor(color),
                font: `${fontSize ? fontSize : '50'}px ${fontFamily}`,
                textStroke: {
                    color: window.etro.parseColor(strokeColor),
                    position: `TextStrokePosition.${strokePosition}`,
                    thickness: 1
                },
            });
            if (movie.layers[movie.layers.length - 1].text) {
                movie.layers.pop()
            }
            movie.layers.push(textlayer)
            movie.refresh();
        }
    }

    grayscale_effect() {
        const effect = new window.etro.effect.Grayscale()
        movie.effects.push(effect)
        $('#grayscale').addClass('selected_effect')
        $('#blur').removeClass('selected_effect')
        $('#blur_radius').addClass('hidden')
        movie.refresh();
    }

    blur_effect() {
        var radius = document.getElementById('blur_radius_input').value
        const effect = new etro.effect.GaussianBlur({
            radius: parseInt(radius),
        })
        movie.effects.push(effect)
        movie.refresh();
        $('#blur').addClass('selected_effect')
        $('#grayscale').removeClass('selected_effect')
        $('#blur_radius').removeClass('hidden')
    }
}
