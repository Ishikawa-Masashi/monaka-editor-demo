export class MouseDownState {
  private _leftButton: boolean;
  public get leftButton(): boolean {
    return this._leftButton;
  }
  private position = { x: 0, y: 0 };
  constructor() {
    // this._altKey = false;
    // this._ctrlKey = false;
    // this._metaKey = false;
    // this._shiftKey = false;
    this._leftButton = false;
    // this._middleButton = false;
    // this._startedOnLineNumbers = false;
    // this._lastMouseDownPosition = null;
    // this._lastMouseDownPositionEqualCount = 0;
    // this._lastMouseDownCount = 0;
    // this._lastSetMouseDownCountTime = 0;
    // this.isDragAndDrop = false;
    console.log('create mousedonw state!');
  }
  public setStartButtons(source: { leftButton: boolean }): void {
    this._leftButton = source.leftButton;
    // this._middleButton = source.middleButton;
  }
  public setPosition(position: { x: number; y: number }): void {
    this.position = position;
  }
  public getPosition() {
    return this.position;
  }
}
