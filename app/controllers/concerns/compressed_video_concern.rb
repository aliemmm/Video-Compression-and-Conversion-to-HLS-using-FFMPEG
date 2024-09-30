module CompressedVideoConcern
  def download_blob_to_tempfile(video)
    file_content = video.tempfile.read
    extension = video.content_type.split('/').second != 'quicktime' ? video.content_type.split('/').second : 'mov'
    temp_file = Tempfile.new(['temp_blob', ".#{extension}"])
    temp_file.binmode
    temp_file.write(file_content)
    temp_file.rewind

    compress_video(temp_file.path, video, extension)
  end

  def compress_video(input_path, video, extension)
    movie = FFMPEG::Movie.new(input_path)
    output_path = Rails.root.join('tmp', "compressed_video.#{extension}").to_s
    options = { "c:v": "libx264", "crf": 23, "preset": "medium", "b:v": "1000k" }

    movie.transcode(output_path, options)
    output_path
  end
end