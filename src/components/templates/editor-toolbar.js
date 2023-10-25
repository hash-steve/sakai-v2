export const EditorToolbar = (
    <span>
        <span className="ql-formats">
            <select className="ql-size"></select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
            <select className="ql-color" title="text color"></select>
            <select className="ql-background" title="background color"></select>
        </span>
        <span className="ql-formats">
            <button className="ql-script" value="sub" title=""></button>
            <button className="ql-script" value="super" title=""></button>
        </span>
        <span className="ql-formats">
            <button className="ql-header" value="1"></button>
            <button className="ql-header" value="2"></button>
            <button className="ql-header" value="3">H<sub>3</sub></button>
            <button className="ql-blockquote" title="blockquote"></button>
            <button className="ql-code-block" title=""></button>
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered"></button>
            <button className="ql-list" value="bullet"></button>
            <button className="ql-indent" value="-1"></button>
            <button className="ql-indent" value="+1"></button>
        </span>
        <span className="ql-formats">
            <button className="ql-direction" value="rtl"></button>
            <select className="ql-align"></select>
        </span>
        <span className="ql-formats">
            <button className="ql-link"></button>
            <button className="ql-image"></button>
            <button className="ql-video"></button>
            <button className="ql-formula"></button>
        </span>
        <span className="ql-formats">
            <button className="ql-clean" title="remove formatting"></button>
        </span>
    </span>
)