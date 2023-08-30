import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuid } from 'uuid';
import { ElementState, Preview, PreviewState } from '@creatomate/preview';
import { groupBy } from '@/helpers/groupBy';
import { deepClone } from '../helpers/deepClone';

class VideoCreatorStore {
  preview?: Preview = undefined;

  state?: PreviewState = undefined;

  source?: any = undefined;

  tracks?: Map<number, ElementState[]> = undefined;

  activeElementIds: string[] = [];

  isLoading = true;

  isPlaying = false;

  time = 0;

  timelineScale = 100;

  isScrubbing = false;

  constructor() {
    makeAutoObservable(this);
  }

  initializeVideoPlayer(htmlElement: HTMLDivElement) {
    if (this.preview) {
      this.preview.dispose();
      this.preview = undefined;
    }

    const preview = new Preview(htmlElement, 'interactive', process.env.NEXT_PUBLIC_VIDEO_PLAYER_TOKEN!);

    this.preview = preview;

    preview.onReady = async () => {
      await preview.setSource(this.getDefaultSource());
    };

    preview.onLoad = async () => {
      runInAction(() => (this.isLoading = true));
    };

    preview.onLoadComplete = async () => {
      runInAction(() => (this.isLoading = false));
    };

    preview.onPlay = () => {
      runInAction(() => (this.isPlaying = true));
    };

    preview.onPause = () => {
      runInAction(() => (this.isPlaying = false));
    };

    preview.onTimeChange = (time) => {
      if (!this.isScrubbing) {
        runInAction(() => (this.time = time));
      }
    };

    preview.onActiveElementsChange = (elementIds) => {
      runInAction(() => (this.activeElementIds = elementIds));
    };

    preview.onStateChange = (state) => {
      runInAction(() => {
        this.state = state;
        this.tracks = groupBy(state.elements, (element) => element.track);
      });
    };
  }

  async setTime(time: number): Promise<void> {
    this.time = time;
    await this.preview?.setTime(time);
  }

  async setActiveElements(...elementIds: string[]): Promise<void> {
    this.activeElementIds = elementIds;
    await this.preview?.setActiveElements(elementIds);
  }

  getActiveElement(): ElementState | undefined {
    if (!this.preview || this.activeElementIds.length === 0) {
      return undefined;
    }

    const id = videoCreator.activeElementIds[0];
    return this.preview.findElement((element) => element.source.id === id, this.state);
  }

  async createElement(elementSource: Record<string, any>): Promise<void> {
    const preview = this.preview;
    if (!preview || !preview.state) {
      return;
    }

    const source = preview.getSource();
    const newTrack = Math.max(...preview.state.elements.map((element) => element.track)) + 1;

    const id = uuid();

    source.elements.push({
      id,
      track: newTrack,
      ...elementSource,
    });

    await preview.setSource(source, true);

    await this.setActiveElements(id);
  }

  async deleteElement(elementId: string): Promise<void> {
    const preview = this.preview;
    if (!preview || !preview.state) {
      return;
    }

    // Clone the current preview state
    const state = deepClone(preview.state);

    // Remove the element
    state.elements = state.elements.filter((element) => element.source.id !== elementId);

    // Set source by the mutated state
    await preview.setSource(preview.getSource(state), true);
  }

  async rearrangeTracks(track: number, direction: 'up' | 'down'): Promise<void> {
    const preview = this.preview;
    if (!preview || !preview.state) {
      return;
    }

    // The track number to swap with
    const targetTrack = direction === 'up' ? track + 1 : track - 1;
    if (targetTrack < 1) {
      return;
    }

    // Elements at provided track
    const elementsCurrentTrack = preview.state.elements.filter((element) => element.track === track);
    if (elementsCurrentTrack.length === 0) {
      return;
    }

    // Clone the current preview state
    const state = deepClone(preview.state);

    // Swap track numbers
    for (const element of state.elements) {
      if (element.track === track) {
        element.source.track = targetTrack;
      } else if (element.track === targetTrack) {
        element.source.track = track;
      }
    }

    // Set source by the mutated state
    await preview.setSource(preview.getSource(state), true);
  }



  async finishVideo(): Promise<any> {
    const preview = this.preview;
    if (!preview) {
      return;
    }

    const response = await fetch('/api/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: preview.getSource(),
      }),
    });

    return await response.json();
  }

  getDefaultSource() {
    // Replace this with your own JSON source

    return this.source
  }
}

export const videoCreator = new VideoCreatorStore();
