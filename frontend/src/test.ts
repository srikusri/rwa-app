// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js/testing'; // Order matters, import first
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// declare const require: {
//   context(path: string, deep?: boolean, filter?: RegExp): {
//     <T>(id: string): T;
//     keys(): string[];
//   };
// };

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Then we find all the tests.
// const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
// context.keys().map(context);
//
// Commented out require.context as it's a webpack-specific feature.
// Angular CLI handles test discovery differently now, often via tsconfig.spec.json includes.
// This minimal setup is often enough for Karma to start with modern Angular.
