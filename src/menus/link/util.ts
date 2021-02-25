/**
 * 获取除了最外层的P外的顶级Node
 */
function getTopNode(node: Node, topText: string): Node {
    let pointerNode: Node = node
    let topNode: Node = node
    do {
        if (pointerNode.textContent === topText) break
        topNode = pointerNode
        if (pointerNode.parentNode) {
            pointerNode = pointerNode?.parentNode
        }
    } while (pointerNode?.nodeName !== 'P')

    return topNode
}

/**
 * 生成html的string形式
 */
function makeHtmlString(tagName: string, content: string): string {
    if (tagName === '' || tagName === '#text') {
        return content
    }
    tagName = tagName.toLowerCase()
    return `<${tagName}>${content}</${tagName}>`
}

/**
 * 生成开始或者结束位置的html字符片段
 */
function createPartHtml(node: Node, startPos: number, endPost?: number): string {
    let selectionContent = node.textContent?.substring(startPos, endPost)
    let pointerNode = node
    let content = ''
    do {
        content = makeHtmlString(pointerNode?.nodeName ?? '', selectionContent ?? '')
        selectionContent = content
        if (pointerNode.parentNode) pointerNode = pointerNode?.parentNode
    } while (pointerNode?.nodeName !== 'P')

    return content
}

function getTopText(node: Node) {
    let temp = node
    while (temp.nodeName !== 'P') {
        if (temp.parentNode) temp = temp?.parentNode
    }
    return temp?.textContent
}

/**
 * 生成需要插入的html内容的字符串形式
 */
function insertHtml(selection: Selection): string {
    const anchorNode = selection.anchorNode
    const focusNode = selection.focusNode
    const anchorPos = selection.anchorOffset
    const focusPos = selection.focusOffset

    let content: string = ''
    let startContent: string = ''
    let middleContent: string = ''
    let endContent: string = ''

    let startNode = anchorNode
    let endNode = focusNode
    // 用来保存 anchorNode的非p最外层节点
    let pointerNode = anchorNode

    // 节点是同一个的处理
    if (anchorNode?.isEqualNode(focusNode ?? null)) {
        return createPartHtml(anchorNode, anchorPos, focusPos)
    }

    // 选中开始位置节点的处理
    if (anchorNode) startContent = createPartHtml(anchorNode, anchorPos ?? 0)

    // 结束位置节点的处理
    if (focusNode) endContent = createPartHtml(focusNode, 0, focusPos)

    if (anchorNode) {
        console.log(getTopText(anchorNode))
    }

    // 将指针节点位置放置到开始的节点
    if (anchorNode) {
        // 获取start的非p顶级node
        startNode = getTopNode(anchorNode, getTopText(anchorNode) ?? '')
    }
    if (focusNode) {
        // 获取end的非p顶级node
        endNode = getTopNode(focusNode, getTopText(focusNode) ?? '')
    }

    console.log(startNode)
    console.log(endNode)

    // 处于开始和结束节点位置之间的节点的处理
    pointerNode = startNode?.nextSibling ?? anchorNode
    console.log(pointerNode)
    while (!pointerNode?.isEqualNode(endNode ?? null)) {
        const pointerNodeName = pointerNode?.nodeName
        if (pointerNodeName === '#text') {
            middleContent = middleContent + pointerNode?.textContent
        } else {
            let htmlString = pointerNode?.firstChild?.parentElement?.innerHTML
            middleContent = middleContent + makeHtmlString(pointerNodeName ?? '', htmlString ?? '')
        }
        pointerNode = pointerNode?.nextSibling ?? pointerNode
    }

    content = `${startContent}${middleContent}${endContent}`

    return content
}

export { getTopNode, makeHtmlString, createPartHtml, insertHtml }
