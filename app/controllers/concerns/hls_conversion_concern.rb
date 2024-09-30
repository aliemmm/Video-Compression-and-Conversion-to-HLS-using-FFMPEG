module HlsConversionConcern
  def convert_to_hls(video_path)
    input_path = video_path
    secure_random = SecureRandom.uuid
    output_path = Rails.root.join('tmp', secure_random)
    FileUtils.mkdir_p(output_path) unless Dir.exist?(output_path)
    output_file = output_path.join('output.m3u8').to_s

    movie = FFMPEG::Movie.new(input_path)
    movie.transcode(output_file, hls_transcode_options(input_path, output_path)) { |progress| puts progress }
    File.delete(video_path)
    output_file
  end

  private

  def hls_transcode_options(input_path, output_path)
    [
      '-i', input_path,
      '-c:v', 'libx264', '-b:v', '4000k',
      '-c:a', 'aac', '-b:a', '128k',
      '-f', 'hls',
      '-hls_time', '10',
      '-hls_list_size', '0',
      '-hls_segment_filename', "#{output_path}/segment%03d.ts",
      '-force_key_frames', 'expr:gte(t,n_forced*10)',
    ]
  end

  def get_segment_duration(segment)
    duration = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 #{segment}`.strip
    duration.to_f
  end

  def get_frame_rate(input_file)
    frame_rate_info = `ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 #{input_file}`.strip
    eval(frame_rate_info).to_f
  end
end