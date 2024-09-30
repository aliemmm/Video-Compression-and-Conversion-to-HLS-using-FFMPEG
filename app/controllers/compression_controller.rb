class CompressionController < ApplicationController
  include CompressedVideoConcern
  include HlsConversionConcern

  def index; end

  def create
    compressed_video_path = download_blob_to_tempfile(params[:video])
    hls_file = convert_to_hls(compressed_video_path)
    redirect_to compression_index_path
  end
end