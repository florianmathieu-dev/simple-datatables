import {cellType} from "../interfaces"
import {Editor} from "./editor"


interface dataType {
    cell?: cellType;
    rowIndex?: number;
    columnIndex?: number;
    content?: string;
    input?: HTMLInputElement;
    row?: cellType[];
    inputs?: HTMLInputElement[];
}

type menuItemType = {
    text?: (editor: Editor) => string,
    action?: (editor: Editor, event: Event) => void,
    separator?: boolean,
    url?: string,
}

interface EditorOptions {
    classes?: {
        row?: string,
        form?: string,
        item?: string,
        menu?: string,
        save?: string,
        block?: string,
        close?: string,
        inner?: string,
        input?: string,
        label?: string,
        modal?: string,
        action?: string,
        header?: string,
        wrapper?: string,
        editable?: string,
        container?: string,
        separator?: string,
    },
    labels?: {
        editCell?: string,
        editRow?: string,
        removeRow?: string,
        reallyRemove?: string
    }
    // include hidden columns in the editor
    hiddenColumns?: boolean,

    // enable the context menu
    contextMenu?: boolean,

    // event to start editing
    clickEvent?: string,

    // indexes of columns not to be edited
    excludeColumns?: number[],
    menuItems?: menuItemType[]
}

export {
    dataType,
    menuItemType,
    EditorOptions
}
