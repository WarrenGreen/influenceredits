import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuid } from 'uuid';
import { ElementState, Preview, PreviewState } from '@creatomate/preview';
import { groupBy } from '@/helpers/groupBy';

import { deepClone } from '../helpers/deepClone';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


const templateIds = ["174b43a2-1ab2-4954-8d38-2f289d5e6129"];

class OverlayCreatorStore {
  preview?: Preview = undefined;

  state?: PreviewState = undefined;

  source?: any = undefined;

  tracks?: Map<number, ElementState[]> = undefined;

  resolution?: number[] = undefined;

  activeElementIds: string[] = [];

  fillType: string = 'fill';

  isLoading = true;

  isPlaying = false;

  time = 0;

  timelineScale = 100;

  isScrubbing = false;
  supabaseClient = createClientComponentClient();

  baseSource: any = undefined;
  template: any = [];
  projectId = null;
  constructor() {
    makeAutoObservable(this);
  }

  initializeVideoPlayer(htmlElement: HTMLDivElement, newSource: any, projectId) {
    if (this.preview) {
      this.preview.dispose();
      this.preview = undefined;
    }

    this.projectId = projectId
    this.baseSource = deepClone(newSource);

    const preview = new Preview(htmlElement, 'interactive', process.env.NEXT_PUBLIC_VIDEO_PLAYER_TOKEN!);

    this.preview = preview;

    preview.onReady = async () => {

      await preview.setSource(newSource);
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

    preview.onStateChange = async (state) => {
      runInAction(() => {
        this.state = state;
        this.tracks = groupBy(state.elements, (element) => element.track);
      });
      console.log("innerchange")
      await this.supabaseClient.from("project").update({source: this.preview?.getSource()}).eq("id", projectId)
      console.log("innerchange 2")
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

    const id = overlayCreator.activeElementIds[0];
    return this.preview.findElement((element) => element.source.id === id, this.state);
  }

  async applyTemplate() {
    await Promise.all(templateIds.map(async (templateId) => {await this.deleteElement(templateId)}))

    const newSource = this.preview.getSource();


    deepClone(this.template).map((templateElement) => {
      const scaler = Math.min(overlayCreator.preview.getSource().width, overlayCreator.preview.getSource().height)
      let templateLogoWidth;
      let templateLogoHeight;

      if (templateElement.width <= templateElement.height) {
        templateLogoWidth = Math.round(overlayCreator.preview.getSource().width * .20)
        templateLogoHeight = templateLogoWidth * templateElement.height / templateElement.width 

        if (templateLogoHeight >= overlayCreator.preview.getSource().height ) {
          templateLogoHeight = Math.round(overlayCreator.preview.getSource().height * .80)
          templateLogoWidth = templateLogoHeight * templateElement.width  / templateElement.height
        }
      }else{
        templateLogoHeight =  Math.round(overlayCreator.preview.getSource().height * .20)
        templateLogoWidth = templateLogoHeight * templateElement.width  / templateElement.height

        if (templateLogoWidth >= overlayCreator.preview.getSource().width ) {
          
          templateLogoWidth = Math.round(overlayCreator.preview.getSource().width * .80)
          templateLogoHeight = templateLogoWidth * templateElement.height / templateElement.width 
        }
      }
      
      
      templateElement.height = templateLogoHeight
      templateElement.width = templateLogoWidth
      templateElement.x = Math.round(templateElement.width  /2) + 10
      templateElement.y = Math.round(templateElement.height /2) + 10
      newSource.elements.push(templateElement)
    })
    await this.preview.setSource(newSource)
  }

  async createElement(elementSource: Record<string, any>, ): Promise<void> {
    const preview = this.preview;

    if (!preview || !preview.state) {
      return;
    }

    const source = preview.getSource();
    //const newTrack = 0; // Math.max(...preview.state.elements.map((element) => element.track)) + 1;

    //const id = uuid();

    source.elements.push({
      ...elementSource,
    });

    await preview.setSource(source, true);
    await this.setActiveElements(elementSource.id);
  }

  async setResolution(resolution: number[]) {
    const preview = this.preview;

    if (!preview || !preview.state) {
      return;
    }
    const source = preview.getSource();
    source.width = resolution[0]
    source.height = resolution[1]
    await preview.setSource(source, true);
    await this.setFillType(this.fillType);
    await this.applyTemplate()
  }

  async setVideoResolution(resolution: number[]) {
    const preview = this.preview;

    if (!preview || !preview.state) {
      return;
    }
    const source = preview.getSource();
    source.elements = source.elements.map((element: any) => {return {...element, width: resolution[0], height: resolution[1]}})
    this.baseSource = source
    await preview.setSource(source, true);
    await this.applyTemplate()

  }

  getWidth(fullSizeWidth: number, fullSizeHeight: number, height:number ) {
    return Math.round(height * fullSizeWidth / fullSizeHeight);
  }

  getHeight(fullSizeWidth: number, fullSizeHeight: number, width:number ) {
    return Math.round(width * fullSizeHeight  / fullSizeWidth);
  }

  async setFillType(newFillType: string): Promise<void> {
    this.fillType = newFillType;
    const preview = this.preview;
    if (!preview || !preview.state) {
      return;
    }


    // Clone the current preview state
    const source = preview.getSource();
    if (!source.elements || source.elements.length ==0 ) {
      return
    }


    const canvasResolution = [source.width, source.height];
    const videoResolution = [source.elements[0].width, source.elements[0].height];
    console.log("@@@@@@")
    console.log(newFillType.toLowerCase() )

    if (newFillType.toLowerCase() == "fill") {
      if (videoResolution[0] >= videoResolution[1]){
        this.setVideoResolution([this.getWidth(videoResolution[0], videoResolution[1], canvasResolution[1]), canvasResolution[1]])
      } else{
        this.setVideoResolution([canvasResolution[0], this.getHeight(videoResolution[0], videoResolution[1], canvasResolution[0])])
      }

    } else {
      if (videoResolution[0] >= videoResolution[1]){
        this.setVideoResolution([canvasResolution[0], this.getHeight(videoResolution[0], videoResolution[1], canvasResolution[0])])
        console.log("hit")
        console.log(canvasResolution[0])
        console.log(this.getHeight(videoResolution[0], videoResolution[1], canvasResolution[0]))
      } else {
        this.setVideoResolution([this.getWidth(videoResolution[0], videoResolution[1], canvasResolution[1]), canvasResolution[1]])
      }

    }
    console.log("@@@@@@")

    // Remove the element
    // state.elements = state.elements.filter((element) => element.source.id !== elementId);
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

export const overlayCreator = new OverlayCreatorStore();
