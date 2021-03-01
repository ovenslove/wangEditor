import { insertHtml } from '../../../../src/menus/link/util'

describe('测试insertHtml函数', () => {
    test('选区achoreNode和focusNode是同一个且外层只有p标签包裹', () => {
        document.body.innerHTML = `<p id="link">123456</p>`
        const p = document.getElementById('link')
        const anchorNode = p.childNodes[0]
        const selection = { anchorNode: anchorNode, focusNode: anchorNode, anchorOffset: 2, focusOffset: 5 }

        const htmlString = insertHtml(selection as Selection, '123456')
    })
})