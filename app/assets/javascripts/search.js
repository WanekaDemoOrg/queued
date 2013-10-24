var Search = {
  init: function(){
    $(document).on('click', '.search-submit', Search.fetchSearchResults)
    $(document).on('click', '.add-to-queue-submit', Search.addSongToQueue)
  },
  addSongToQueue: function(e) {
    Sync.addSongToQueue($(e.target).closest('div').parent())
  },
  fetchSearchResults: function(e){
    e.preventDefault()

    var term = $(this).closest('form').find('.search-input-term').val()
    $.ajax({
      url: '/search',
      type: 'post',
      data: {song: term},
      dataType: 'json'
    })
    .done(Search.displaySearchResults)
  },
  resetSearchResults: function(){
    $('.search-container').find('.results-container').html('')
  },
  displaySearchResults: function(rdioResponse){
    // TODO: why the FIZUCK doesn't dataType: json above in the ajax call work?
    var rdioData = JSON.parse(rdioResponse)
    Search.resetSearchResults()
    $.each(rdioData.result.results, function(i, rdioSingleResult){
      $('.results-container').append(Search.buildResultRow(rdioSingleResult))
    })
    bindAddSong()
    (rdioData.result.results.length >= 4) ? $('.result').addClass('pure-u-1-8') : $('.result').addClass('pure-u-2-4')
  },
  //TODO: STOP CHOPPING CHARACTERS
  limitCharacters: function(str){
    var limit = 30
    return str.substring(0,limit-1)
  },
  buildResultRow: function(rdioSingleResult){
    return $('<div>', {class: 'single-track result'} ).data('songkey', rdioSingleResult.key)
    .append(
      $('<div>', {class: 'album-art-container'})
      .append(
        $('<img>', {src: '/assets/overlay-click-200.png', class: 'overlay'}),
        $('<img>', {src: rdioSingleResult.icon, class: 'front-page-art result-album-art'})
      ),
      $('<div>', {class: 'result-song-details'})
      .append(
        $('<span>', {class: 'result-artist'} ).text(this.limitCharacters(rdioSingleResult.artist)),
        $('<span>', {class: 'result-song'} ).text(this.limitCharacters(rdioSingleResult.name)),
        $('<span>', {class: 'result-album'} ).html(this.limitCharacters(rdioSingleResult.album))
      )
    )
  }
}
