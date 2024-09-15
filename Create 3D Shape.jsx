(function createNullsFromPaths(thisObj) {
    const version = 'v1.0.0'
    const myEmail = '664823818@qq.com'

    //本地化
    const localizeData = {
        title: { en: 'Create 3D Shape', zh: '创建3D形状图层' },
        optionsLabel: { en: 'options', zh: '选项' },
        aboutLabel: { en: 'about', zh: '关于' },
        positionLabel: { en: 'position:', zh: '位置:' },
        centerOfCurrentCompLabel: { en: 'center of current comp', zh: '当前合成中心' },
        createCentralNullObjectLabel: { en: 'create central null object', zh: '创建中心空对象' },
        createPrecomposeLabel: { en: 'create precompose', zh: '创建预合成' },
        checkUpdateLabel: { en: 'please check update on: %1', zh: '请在此检查更新: %1' },
        notAllowNetworkLabel: { en: 'Since the "Allow Scripts to Write Files and Access Network" option is turned off, please access it manually: %1', zh: '由于"允许脚本写入文件并访问网络"选项已关闭, 请手动访问: %1' },
        contactLabel: { en: 'contact: %1', zh: '联系: %1' },
        cubeLabel: { en: 'cube', zh: '正方体' },
        cuboidLabel: { en: 'cuboid', zh: '长方体' },
        extrusionLabel: { en: 'extrusion', zh: '挤压' },
        edgeLengthLabel: { en: 'edge length', zh: '边长' },
        createLabel: { en: 'create', zh: '创建' },
        createCubeUndoName: { en: 'Create 3D Shape:create cube', zh: '创建3D形状图层:创建正方体' },
        xLengthLabel: { en: 'x length', zh: 'x边长' },
        yLengthLabel: { en: 'y length', zh: 'y边长' },
        zLengthLabel: { en: 'z length', zh: 'z边长' },
        createCuboidUndoName: { en: 'Create 3D Shape:create cuboid', zh: '创建3D形状图层:创建长方体' },
        extrusionDepthLabel: { en: 'extrusion depth', zh: '挤压深度' },
        baseOnOriginLayerLabel: { en: 'position base on origin layer', zh: '位置基于源图层' },
        createExtrusionUndoName: { en: 'Create 3D Shape:create extrusion', zh: '创建3D形状图层:创建挤压' },
        pleaseSelectAComp: { en: 'please select a comp', zh: '请选择一个合成' },
        pleaseSelectAPath: { en: 'please select a path', zh: '请选择一个路径' }
    }
    $.localize = true

    //初始化ui
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window('palette', localizeData.title)
        win.spacing = 4
        win.margins = 4
        win.alignChildren = 'fill'

        //顶部选项卡面板
        var headTabbedPanel = win.add('tabbedpanel')
        var optionsTab = headTabbedPanel.add('tab', undefined, localizeData.optionsLabel)
        optionsTab.spacing = 4
        optionsTab.margins = 4
        var aboutTab = headTabbedPanel.add('tab', undefined, localizeData.aboutLabel)
        aboutTab.spacing = 4
        aboutTab.margins = 4

        //位置
        var group1 = optionsTab.add('group')
        group1.spacing = 4
        group1.margins = 4
        group1.orientation = 'row'
        group1.add('StaticText', undefined, localizeData.positionLabel)

        var centerPosition = getCenterPosition()
        group1.add('StaticText', undefined, 'x')
        win.xEditText = group1.add('EditText', [0, 0, 60, 32], centerPosition[0])

        group1.add('StaticText', undefined, 'y')
        win.yEditText = group1.add('EditText', [0, 0, 60, 32], centerPosition[1])

        group1.add('StaticText', undefined, 'z')
        win.zEditText = group1.add('EditText', [0, 0, 60, 32], centerPosition[2])

        win.setCenterButton = group1.add('Button', undefined, localizeData.centerOfCurrentCompLabel)
        win.setCenterButton.onClick = function () {
            var centerPosition = getCenterPosition()
            win.xEditText.text = centerPosition[0]
            win.yEditText.text = centerPosition[1]
            win.zEditText.text = centerPosition[2]
        }

        //创建中心空对象
        var createNullCheckbox = optionsTab.add('checkbox', undefined, localizeData.createCentralNullObjectLabel)

        //创建预合成
        var createPreComp = optionsTab.add('checkbox', undefined, localizeData.createPrecomposeLabel)
        createPreComp.value = true

        //关于
        aboutTab.add('StaticText', undefined, 'Create 3D Shape (' + version + ')')
        var aboutGroup = aboutTab.add('group')
        aboutGroup.spacing = 4
        aboutGroup.margins = 4
        aboutGroup.orientation = 'row'
        aboutGroup.add('StaticText', undefined, localize(localizeData.checkUpdateLabel, ''))
        aboutGroup.add('button', undefined, 'Github').onClick = function () {
            var url = 'https://github.com/xyh20180101/Create-3D-Shape'

            if (app.preferences.getPrefAsLong('Main Pref Section', 'Pref_SCRIPTING_FILE_NETWORK_SECURITY') != 1) {
                alert(localize(localizeData.notAllowNetworkLabel, url))
            }

            if ($.os.indexOf('Windows') != -1)
                system.callSystem('explorer ' + url)
            else
                system.callSystem('open ' + url)
        }
        aboutTab.add('StaticText', undefined, localize(localizeData.contactLabel, myEmail))

        //选项卡面板
        var tabbedPanel = win.add('tabbedpanel')
        var cubeTab = tabbedPanel.add('tab', undefined, localizeData.cubeLabel)
        cubeTab.spacing = 4
        cubeTab.margins = 4
        var cuboidTab = tabbedPanel.add('tab', undefined, localizeData.cuboidLabel)
        cuboidTab.spacing = 4
        cuboidTab.margins = 4
        var extrusionTab = tabbedPanel.add('tab', undefined, localizeData.extrusionLabel)
        extrusionTab.spacing = 4
        extrusionTab.margins = 4
        win.tabbedPanel = tabbedPanel

        //立方体选项卡
        var cubeTabGroup1 = cubeTab.add('group')
        cubeTabGroup1.spacing = 4
        cubeTabGroup1.margins = 4
        cubeTabGroup1.orientation = 'row'

        cubeTabGroup1.add('StaticText', undefined, localizeData.edgeLengthLabel)
        win.cubeTabEdgeLengthEditText = cubeTabGroup1.add('EditText', [0, 0, 60, 32], '100')

        var cubeTabCreateButton = cubeTab.add('button', undefined, localizeData.createLabel)
        cubeTabCreateButton.onClick = function () {
            app.beginUndoGroup(localize(localizeData.createCubeUndoName))
            cube([Number(win.xEditText.text), Number(win.yEditText.text), Number(win.zEditText.text)],
                Number(win.cubeTabEdgeLengthEditText.text),
                createNullCheckbox.value,
                createPreComp.value)
            app.endUndoGroup()
        }

        //长方体选项卡
        var cuboidTabGroup1 = cuboidTab.add('group')
        cuboidTabGroup1.spacing = 4
        cuboidTabGroup1.margins = 4
        cuboidTabGroup1.orientation = 'row'

        cuboidTabGroup1.add('StaticText', undefined, localizeData.xLengthLabel)
        win.cuboidTabXLengthEditText = cuboidTabGroup1.add('EditText', [0, 0, 60, 32], '100')
        cuboidTabGroup1.add('StaticText', undefined, localizeData.yLengthLabel)
        win.cuboidTabYLengthEditText = cuboidTabGroup1.add('EditText', [0, 0, 60, 32], '200')
        cuboidTabGroup1.add('StaticText', undefined, localizeData.zLengthLabel)
        win.cuboidTabZLengthEditText = cuboidTabGroup1.add('EditText', [0, 0, 60, 32], '100')

        var cuboidTabCreateButton = cuboidTab.add('button', undefined, localizeData.createLabel)
        cuboidTabCreateButton.onClick = function () {
            app.beginUndoGroup(localize(localizeData.createCuboidUndoName))
            cuboid([Number(window.xEditText.text), Number(window.yEditText.text), Number(window.zEditText.text)],
                [Number(win.cuboidTabXLengthEditText.text), Number(win.cuboidTabYLengthEditText.text), Number(win.cuboidTabZLengthEditText.text)],
                createNullCheckbox.value,
                createPreComp.value)
            app.endUndoGroup()
        }

        //挤压选项卡
        var extrusionTabGroup1 = extrusionTab.add('group')
        extrusionTabGroup1.spacing = 4
        extrusionTabGroup1.margins = 4
        extrusionTabGroup1.orientation = 'row'

        extrusionTabGroup1.add('StaticText', undefined, localizeData.extrusionDepthLabel)
        win.extrusionTabExtrusionDepthEditText = extrusionTabGroup1.add('EditText', [0, 0, 60, 32], '100')

        var extrusionTabCreateButton = extrusionTab.add('button', undefined, localizeData.createLabel)
        extrusionTabCreateButton.onClick = function () {
            app.beginUndoGroup(localize(localizeData.createExtrusionUndoName))
            extrusion([Number(window.xEditText.text), Number(window.yEditText.text), Number(window.zEditText.text)],
                Number(win.extrusionTabExtrusionDepthEditText.text),
                createNullCheckbox.value,
                createPreComp.value)
            app.endUndoGroup()
        }

        win.layout.layout(true)
        return win
    }

    var window = buildUI(thisObj);
    if (window.toString() == '[object Panel]') {
        window
    } else {
        window.show()
    }

    //获取活动合成
    function getActiveComp() {
        var theComp = app.project.activeItem
        if (theComp == undefined)
            return null
        return theComp
    }

    function getCenterPoint(point1, point2) {
        return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2]
    }

    function getDistance(point1, point2) {
        return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2))
    }

    function getAngle(point1, point2) {
        return Math.atan((point2[1] - point1[1]) / (point2[0] - point1[0])) * 180 / Math.PI
    }

    //获取选择形状
    function getSelectedShape() {
        var comp = getActiveComp()
        if (comp == null) {
            alert(localizeData.pleaseSelectAComp)
            return
        }
        var properties = []
        for (var i = 0; i < comp.selectedProperties.length; i++) {
            if (comp.selectedProperties[i] instanceof Property)
                properties.push(comp.selectedProperties[i])
        }
        if (properties.length === 0 || properties.length > 1 || properties[0].matchName !== 'ADBE Vector Shape') {
            alert(localizeData.pleaseSelectAPath)
            return
        }
        return { shapeLayer: comp.selectedLayers[0], shape: properties[0].value }

    }

    //设置位置为合成中心点
    function getCenterPosition() {
        var comp = getActiveComp()

        if (comp != null)
            return [comp.width / 2, comp.height / 2, 0]
        else
            return [0, 0, 0]
    }

    //创建中心空对象并绑定
    function createNullObjectAndBind(comp, position, layers) {
        var n = comp.layers.addNull()
        n.threeDLayer = true
        n.position.setValue(position)
        for (var i = 0; i < layers.length; i++) {
            layers[i].parent = n
        }
        n.enabled = false
        return n
    }

    //select
    function arrayMap(array, key) {
        var r = []
        for (var i = 0; i < array.length; i++)
            r.push(array[i][key])
        return r
    }

    //创建预合成
    function createPreComp(comp, layerIndicies, position) {
        var precomp = comp.layers.precompose(layerIndicies, window.tabbedPanel.selection.text)
        comp.layers[1].threeDLayer = true
        comp.layers[1].collapseTransformation = true
        comp.layers[1].position.setValue(position)
    }

    //创建立方体
    function cube(position, edgeLength, isCreateNull, isCreatePrecomp) {
        var comp = getActiveComp()
        if (comp == null) {
            alert(localizeData.pleaseSelectAComp)
            return
        }

        var l = edgeLength

        var shapes = []
        for (var i = 0; i < 6; i++) {
            shapes[i] = comp.layers.addShape()
            shapes[i].threeDLayer = true
            var contents = shapes[i].Contents
            var rect = contents.addProperty('ADBE Vector Shape - Rect')
            rect.property('ADBE Vector Rect Size').setValue([l, l])
            contents.addProperty('ADBE Vector Graphic - Stroke')
            contents.addProperty('ADBE Vector Graphic - Fill')
        }

        var p = isCreatePrecomp ? getCenterPosition() : position

        shapes[0].position.setValue([p[0], p[1], p[2] + l / 2])
        shapes[1].position.setValue([p[0], p[1], p[2] - l / 2])
        shapes[2].position.setValue([p[0], p[1] + l / 2, p[2]])
        shapes[3].position.setValue([p[0], p[1] - l / 2, p[2]])
        shapes[4].position.setValue([p[0] + l / 2, p[1], p[2]])
        shapes[5].position.setValue([p[0] - l / 2, p[1], p[2]])

        shapes[2].xRotation.setValue(90)
        shapes[3].xRotation.setValue(90)
        shapes[4].yRotation.setValue(90)
        shapes[5].yRotation.setValue(90)

        if (isCreateNull)
            createNullObjectAndBind(comp, p, shapes)

        if (isCreatePrecomp) {
            var layerIndicies = arrayMap(shapes, 'index')
            if (isCreateNull) layerIndicies.push(1)
            createPreComp(comp, layerIndicies, position)
        }

    }

    //创建长方体
    function cuboid(position, xyzLength, isCreateNull, isCreatePrecomp) {
        var comp = getActiveComp()
        if (comp == null) {
            alert(localizeData.pleaseSelectAComp)
            return
        }

        var shapes = []
        for (var i = 0; i < 6; i++) {
            shapes[i] = comp.layers.addShape()
            shapes[i].threeDLayer = true
            var contents = shapes[i].Contents
            contents.addProperty('ADBE Vector Shape - Rect')
            contents.addProperty('ADBE Vector Graphic - Stroke')
            contents.addProperty('ADBE Vector Graphic - Fill')
        }

        var l = xyzLength

        shapes[0].Contents.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([l[0], l[1]])
        shapes[1].Contents.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([l[0], l[1]])
        shapes[2].Contents.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([l[0], l[2]])
        shapes[3].Contents.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([l[0], l[2]])
        shapes[4].Contents.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([l[2], l[1]])
        shapes[5].Contents.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([l[2], l[1]])

        var p = isCreatePrecomp ? getCenterPosition() : position

        shapes[0].position.setValue([p[0], p[1], p[2] + l[2] / 2])
        shapes[1].position.setValue([p[0], p[1], p[2] - l[2] / 2])
        shapes[2].position.setValue([p[0], p[1] + l[1] / 2, p[2]])
        shapes[3].position.setValue([p[0], p[1] - l[1] / 2, p[2]])
        shapes[4].position.setValue([p[0] + l[0] / 2, p[1], p[2]])
        shapes[5].position.setValue([p[0] - l[0] / 2, p[1], p[2]])

        shapes[2].xRotation.setValue(90)
        shapes[3].xRotation.setValue(90)
        shapes[4].yRotation.setValue(90)
        shapes[5].yRotation.setValue(90)

        if (isCreateNull)
            createNullObjectAndBind(comp, p, shapes)

        if (isCreatePrecomp) {
            var layerIndicies = arrayMap(shapes, 'index')
            if (isCreateNull) layerIndicies.push(1)
            createPreComp(comp, layerIndicies, position)
        }
    }

    //挤压
    function extrusion(position, extrusionDepth, isCreateNull, isCreatePrecomp) {
        var comp = getActiveComp()
        if (comp == null) {
            alert(localizeData.pleaseSelectAComp)
            return
        }

        var shapeResult = getSelectedShape()
        var selectedShape = shapeResult.shape

        var points = selectedShape.vertices

        //计算各边中心点和长度
        var centerPoints = []
        var lengths = []
        var angles = []
        for (var i = 0; i < points.length - 1; i++) {
            centerPoints.push(getCenterPoint(points[i], points[i + 1]))
            lengths.push(getDistance(points[i], points[i + 1]))
            angles.push(getAngle(points[i], points[i + 1]))
        }

        if (selectedShape.closed) {
            centerPoints.push(getCenterPoint(points[points.length - 1], points[0]))
            lengths.push(getDistance(points[points.length - 1], points[0]))
            angles.push(getAngle(points[points.length - 1], points[0]))
        }

        //生成侧边
        var shapes = []
        var p = isCreatePrecomp ? getCenterPosition() : position

        for (var i = 0; i < centerPoints.length; i++) {
            var xyPosition = centerPoints[i]

            shapes[i] = comp.layers.addShape()
            shapes[i].threeDLayer = true
            var contents = shapes[i].Contents
            contents.addProperty('ADBE Vector Shape - Rect')
            contents.addProperty('ADBE Vector Graphic - Stroke')
            contents.addProperty('ADBE Vector Graphic - Fill')

            shapes[i].Contents.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([lengths[i], extrusionDepth])
            shapes[i].position.setValue([xyPosition[0] + p[0], xyPosition[1] + p[1], p[2]])
            shapes[i].xRotation.setValue(90)
            shapes[i].yRotation.setValue(angles[i])
        }

        //生成正反面
        var front = comp.layers.addShape()
        front.threeDLayer = true
        var contents = front.Contents
        contents.addProperty('ADBE Vector Shape - Group')
        contents.addProperty('ADBE Vector Graphic - Stroke')
        contents.addProperty('ADBE Vector Graphic - Fill')

        front.Contents.property('ADBE Vector Shape - Group').property('ADBE Vector Shape').setValue(selectedShape)
        front.position.setValue([p[0], p[1], p[2] + extrusionDepth / 2])

        var back = front.duplicate()
        back.position.setValue([p[0], p[1], p[2] - extrusionDepth / 2])

        shapes.push(front)
        shapes.push(back)

        if (isCreateNull)
            createNullObjectAndBind(comp, p, shapes)

        if (isCreatePrecomp) {
            var layerIndicies = arrayMap(shapes, 'index')
            if (isCreateNull) layerIndicies.push(1)
            createPreComp(comp, layerIndicies, position)
        }
    }

})(this);
