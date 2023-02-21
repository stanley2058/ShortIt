import { UseFormReturnType } from "@mantine/form";
import { UrlFormValue } from "../types/TUrlFormValue";

export type JoyrideHandlerProps = {
  setTourRunning: (update: boolean) => void;
  setRunTour: (update: boolean) => void;
  setEnableTour: (update: boolean) => void;
  setShowAdvanced: (update: boolean) => void;
};

export type JoyrideHandlerCallbackProps = JoyrideHandlerJudgeInfo & {
  isAdvVisible: boolean;
  getForm: () => UseFormReturnType<UrlFormValue>;
};

export type JoyrideHandlerJudgeInfo = {
  index: number;
  lifecycle: string;
  type: string;
};

export default class JoyrideHandler {
  private props: JoyrideHandlerProps;

  constructor(props: JoyrideHandlerProps) {
    this.props = props;
  }

  handles(data: JoyrideHandlerCallbackProps): void {
    if (this.shouldAdvShow(data)) {
      this.pauseUntilAdvShown(data.isAdvVisible);
    } else {
      this.pauseUntilAdvHidden(data.isAdvVisible);
    }

    if (this.shouldUrlShow(data)) {
      this.pauseUntilUrlShown();
      setTimeout(() => {
        data.getForm().setFieldValue("url", "https://ogp.me");
      }, 0);
    }

    if (this.shouldUrlHide(data)) {
      setTimeout(() => {
        data.getForm().reset();
      }, 0);
    }

    if (this.shouldBeDone(data)) {
      setTimeout(() => {
        data.getForm().reset();
      }, 0);
      this.done();
    }
  }

  shouldAdvShow({ index, lifecycle }: JoyrideHandlerJudgeInfo): boolean {
    return (
      (index > 2 && index < 6) || (index === 6 && lifecycle !== "complete")
    );
  }

  shouldUrlShow({ index, lifecycle }: JoyrideHandlerJudgeInfo): boolean {
    return index === 6 && lifecycle !== "complete";
  }

  shouldUrlHide({ index, lifecycle }: JoyrideHandlerJudgeInfo): boolean {
    return index === 6 && lifecycle === "complete";
  }

  shouldBeDone({ type }: JoyrideHandlerJudgeInfo) {
    return type === "tour:end";
  }

  pauseUntilAdvShown(isAdvVisible: boolean): void {
    if (isAdvVisible) return;
    this.props.setRunTour(false);
    this.props.setShowAdvanced(true);
    JoyrideHandler.waitUntil(
      () => !!document.getElementById("inputMeta")?.offsetParent,
      () => this.props.setRunTour(true)
    );
  }

  pauseUntilAdvHidden(isAdvVisible: boolean): void {
    if (!isAdvVisible) return;
    this.props.setRunTour(false);
    this.props.setShowAdvanced(false);
    JoyrideHandler.waitUntil(
      () => !document.getElementById("inputMeta")?.offsetParent,
      () => this.props.setRunTour(true)
    );
  }

  pauseUntilUrlShown() {
    if (this.isMainInputRendered()) return;
    this.props.setRunTour(false);
    JoyrideHandler.waitUntil(
      () => this.isMainInputRendered(),
      () => this.props.setRunTour(true)
    );
  }

  private isMainInputRendered() {
    const val = (document.getElementById("urlInput") as HTMLInputElement)
      ?.value;
    return val === "https://ogp.me";
  }

  done() {
    this.props.setTourRunning(false);
    this.props.setRunTour(false);
    this.props.setShowAdvanced(false);
    this.props.setEnableTour(false);
  }

  /**
   * Wait until an expression success and perform an action
   * @param expr Expression to evaluate
   * @param action Action to perform once evaluate to true
   */
  static waitUntil(expr: () => boolean, action: () => void): void {
    let waiting = 0;
    const timer = setInterval(() => {
      waiting += 1;
      if (expr() || waiting > 20) {
        clearInterval(timer);
        action();
      }
    }, 500);
  }
}
