FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    stylePanelAspectRatio:150 / 100,
    imageResizeTargetWidth: 100,
    imageRsizeTargetHeight: 150
})

FilePond.parse(document.body);