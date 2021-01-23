// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../node_modules/mithril/render/vnode.js":[function(require,module,exports) {
"use strict"

function Vnode(tag, key, attrs, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs, children: children, text: text, dom: dom, domSize: undefined, state: undefined, events: undefined, instance: undefined}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node == null || typeof node === "boolean") return null
	if (typeof node === "object") return node
	return Vnode("#", undefined, undefined, String(node), undefined, undefined)
}
Vnode.normalizeChildren = function(input) {
	var children = []
	if (input.length) {
		var isKeyed = input[0] != null && input[0].key != null
		// Note: this is a *very* perf-sensitive check.
		// Fun fact: merging the loop like this is somehow faster than splitting
		// it, noticeably so.
		for (var i = 1; i < input.length; i++) {
			if ((input[i] != null && input[i].key != null) !== isKeyed) {
				throw new TypeError("Vnodes must either always have keys or never have keys!")
			}
		}
		for (var i = 0; i < input.length; i++) {
			children[i] = Vnode.normalize(input[i])
		}
	}
	return children
}

module.exports = Vnode

},{}],"../node_modules/mithril/render/hyperscriptVnode.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")

// Call via `hyperscriptVnode.apply(startOffset, arguments)`
//
// The reason I do it this way, forwarding the arguments and passing the start
// offset in `this`, is so I don't have to create a temporary array in a
// performance-critical path.
//
// In native ES6, I'd instead add a final `...args` parameter to the
// `hyperscript` and `fragment` factories and define this as
// `hyperscriptVnode(...args)`, since modern engines do optimize that away. But
// ES5 (what Mithril requires thanks to IE support) doesn't give me that luxury,
// and engines aren't nearly intelligent enough to do either of these:
//
// 1. Elide the allocation for `[].slice.call(arguments, 1)` when it's passed to
//    another function only to be indexed.
// 2. Elide an `arguments` allocation when it's passed to any function other
//    than `Function.prototype.apply` or `Reflect.apply`.
//
// In ES6, it'd probably look closer to this (I'd need to profile it, though):
// module.exports = function(attrs, ...children) {
//     if (attrs == null || typeof attrs === "object" && attrs.tag == null && !Array.isArray(attrs)) {
//         if (children.length === 1 && Array.isArray(children[0])) children = children[0]
//     } else {
//         children = children.length === 0 && Array.isArray(attrs) ? attrs : [attrs, ...children]
//         attrs = undefined
//     }
//
//     if (attrs == null) attrs = {}
//     return Vnode("", attrs.key, attrs, children)
// }
module.exports = function() {
	var attrs = arguments[this], start = this + 1, children

	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = this
	}

	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}

	return Vnode("", attrs.key, attrs, children)
}

},{"../render/vnode":"../node_modules/mithril/render/vnode.js"}],"../node_modules/mithril/render/hyperscript.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")
var hyperscriptVnode = require("./hyperscriptVnode")

var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty

function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}

function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}

function execSelector(state, vnode) {
	var attrs = vnode.attrs
	var children = Vnode.normalizeChildren(vnode.children)
	var hasClass = hasOwn.call(attrs, "class")
	var className = hasClass ? attrs.class : attrs.className

	vnode.tag = state.tag
	vnode.attrs = null
	vnode.children = undefined

	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}

		for (var key in attrs) {
			if (hasOwn.call(attrs, key)) newAttrs[key] = attrs[key]
		}

		attrs = newAttrs
	}

	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key) && key !== "className" && !hasOwn.call(attrs, key)){
			attrs[key] = state.attrs[key]
		}
	}
	if (className != null || state.attrs.className != null) attrs.className =
		className != null
			? state.attrs.className != null
				? String(state.attrs.className) + " " + String(className)
				: className
			: state.attrs.className != null
				? state.attrs.className
				: null

	if (hasClass) attrs.class = null

	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			vnode.attrs = attrs
			break
		}
	}

	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		vnode.text = children[0].children
	} else {
		vnode.children = children
	}

	return vnode
}

function hyperscript(selector) {
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}

	var vnode = hyperscriptVnode.apply(1, arguments)

	if (typeof selector === "string") {
		vnode.children = Vnode.normalizeChildren(vnode.children)
		if (selector !== "[") return execSelector(selectorCache[selector] || compileSelector(selector), vnode)
	}

	vnode.tag = selector
	return vnode
}

module.exports = hyperscript

},{"../render/vnode":"../node_modules/mithril/render/vnode.js","./hyperscriptVnode":"../node_modules/mithril/render/hyperscriptVnode.js"}],"../node_modules/mithril/render/trust.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")

module.exports = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}

},{"../render/vnode":"../node_modules/mithril/render/vnode.js"}],"../node_modules/mithril/render/fragment.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")
var hyperscriptVnode = require("./hyperscriptVnode")

module.exports = function() {
	var vnode = hyperscriptVnode.apply(0, arguments)

	vnode.tag = "["
	vnode.children = Vnode.normalizeChildren(vnode.children)
	return vnode
}

},{"../render/vnode":"../node_modules/mithril/render/vnode.js","./hyperscriptVnode":"../node_modules/mithril/render/hyperscriptVnode.js"}],"../node_modules/mithril/hyperscript.js":[function(require,module,exports) {
"use strict"

var hyperscript = require("./render/hyperscript")

hyperscript.trust = require("./render/trust")
hyperscript.fragment = require("./render/fragment")

module.exports = hyperscript

},{"./render/hyperscript":"../node_modules/mithril/render/hyperscript.js","./render/trust":"../node_modules/mithril/render/trust.js","./render/fragment":"../node_modules/mithril/render/fragment.js"}],"../node_modules/mithril/promise/polyfill.js":[function(require,module,exports) {
"use strict"
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")

	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}

	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.prototype.finally = function(callback) {
	return this.then(
		function(value) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return value
			})
		},
		function(reason) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return PromisePolyfill.reject(reason);
			})
		}
	)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}

module.exports = PromisePolyfill

},{}],"../node_modules/mithril/promise/promise.js":[function(require,module,exports) {
var global = arguments[3];
"use strict"

var PromisePolyfill = require("./polyfill")

if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") {
		window.Promise = PromisePolyfill
	} else if (!window.Promise.prototype.finally) {
		window.Promise.prototype.finally = PromisePolyfill.prototype.finally
	}
	module.exports = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") {
		global.Promise = PromisePolyfill
	} else if (!global.Promise.prototype.finally) {
		global.Promise.prototype.finally = PromisePolyfill.prototype.finally
	}
	module.exports = global.Promise
} else {
	module.exports = PromisePolyfill
}

},{"./polyfill":"../node_modules/mithril/promise/polyfill.js"}],"../node_modules/mithril/render/render.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")

module.exports = function($window) {
	var $doc = $window && $window.document
	var currentRedraw

	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}

	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}

	//sanity check to discourage people from doing `vnode.state = ...`
	function checkState(vnode, original) {
		if (vnode.state !== original) throw new Error("`vnode.state` must not be modified")
	}

	//Note: the hook is passed as the `this` argument to allow proxying the
	//arguments without requiring a full array allocation to do so. It also
	//takes advantage of the fact the current `vnode` is the first argument in
	//all lifecycle methods.
	function callHook(vnode) {
		var original = vnode.state
		try {
			return this.apply(original, arguments)
		} finally {
			checkState(vnode, original)
		}
	}

	// IE11 (at least) throws an UnspecifiedError when accessing document.activeElement when
	// inside an iframe. Catch and swallow this error, and heavy-handidly return null.
	function activeElement() {
		try {
			return $doc.activeElement
		} catch (e) {
			return null
		}
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": createText(parent, vnode, nextSibling); break
				case "<": createHTML(parent, vnode, ns, nextSibling); break
				case "[": createFragment(parent, vnode, hooks, ns, nextSibling); break
				default: createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
	}
	var possibleParents = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}
	function createHTML(parent, vnode, ns, nextSibling) {
		var match = vnode.children.match(/^\s*?<(\w+)/im) || []
		// not using the proper parent makes the child element(s) vanish.
		//     var div = document.createElement("div")
		//     div.innerHTML = "<td>i</td><td>j</td>"
		//     console.log(div.innerHTML)
		// --> "ij", no <td> in sight.
		var temp = $doc.createElement(possibleParents[match[1]] || "div")
		if (ns === "http://www.w3.org/2000/svg") {
			temp.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">" + vnode.children + "</svg>"
			temp = temp.firstChild
		} else {
			temp.innerHTML = vnode.children
		}
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		// Capture nodes to remove, so we don't confuse them.
		vnode.instance = []
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			vnode.instance.push(child)
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs = vnode.attrs
		var is = attrs && attrs.is

		ns = getNameSpace(vnode) || ns

		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element

		if (attrs != null) {
			setAttrs(vnode, attrs, ns)
		}

		insertNode(parent, element, nextSibling)

		if (!maybeSetContentEditable(vnode)) {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				if (vnode.tag === "select" && attrs != null) setLateSelectAttrs(vnode, attrs)
			}
		}
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		initLifecycle(vnode.state, vnode, hooks)
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
		}
		else {
			vnode.domSize = 0
		}
	}

	//update
	/**
	 * @param {Element|Fragment} parent - the parent element
	 * @param {Vnode[] | null} old - the list of vnodes of the last `render()` call for
	 *                               this part of the tree
	 * @param {Vnode[] | null} vnodes - as above, but for the current `render()` call.
	 * @param {Function[]} hooks - an accumulator of post-render hooks (oncreate/onupdate)
	 * @param {Element | null} nextSibling - the next DOM node if we're dealing with a
	 *                                       fragment that is not the last item in its
	 *                                       parent
	 * @param {'svg' | 'math' | String | null} ns) - the current XML namespace, if any
	 * @returns void
	 */
	// This function diffs and patches lists of vnodes, both keyed and unkeyed.
	//
	// We will:
	//
	// 1. describe its general structure
	// 2. focus on the diff algorithm optimizations
	// 3. discuss DOM node operations.

	// ## Overview:
	//
	// The updateNodes() function:
	// - deals with trivial cases
	// - determines whether the lists are keyed or unkeyed based on the first non-null node
	//   of each list.
	// - diffs them and patches the DOM if needed (that's the brunt of the code)
	// - manages the leftovers: after diffing, are there:
	//   - old nodes left to remove?
	// 	 - new nodes to insert?
	// 	 deal with them!
	//
	// The lists are only iterated over once, with an exception for the nodes in `old` that
	// are visited in the fourth part of the diff and in the `removeNodes` loop.

	// ## Diffing
	//
	// Reading https://github.com/localvoid/ivi/blob/ddc09d06abaef45248e6133f7040d00d3c6be853/packages/ivi/src/vdom/implementation.ts#L617-L837
	// may be good for context on longest increasing subsequence-based logic for moving nodes.
	//
	// In order to diff keyed lists, one has to
	//
	// 1) match nodes in both lists, per key, and update them accordingly
	// 2) create the nodes present in the new list, but absent in the old one
	// 3) remove the nodes present in the old list, but absent in the new one
	// 4) figure out what nodes in 1) to move in order to minimize the DOM operations.
	//
	// To achieve 1) one can create a dictionary of keys => index (for the old list), then iterate
	// over the new list and for each new vnode, find the corresponding vnode in the old list using
	// the map.
	// 2) is achieved in the same step: if a new node has no corresponding entry in the map, it is new
	// and must be created.
	// For the removals, we actually remove the nodes that have been updated from the old list.
	// The nodes that remain in that list after 1) and 2) have been performed can be safely removed.
	// The fourth step is a bit more complex and relies on the longest increasing subsequence (LIS)
	// algorithm.
	//
	// the longest increasing subsequence is the list of nodes that can remain in place. Imagine going
	// from `1,2,3,4,5` to `4,5,1,2,3` where the numbers are not necessarily the keys, but the indices
	// corresponding to the keyed nodes in the old list (keyed nodes `e,d,c,b,a` => `b,a,e,d,c` would
	//  match the above lists, for example).
	//
	// In there are two increasing subsequences: `4,5` and `1,2,3`, the latter being the longest. We
	// can update those nodes without moving them, and only call `insertNode` on `4` and `5`.
	//
	// @localvoid adapted the algo to also support node deletions and insertions (the `lis` is actually
	// the longest increasing subsequence *of old nodes still present in the new list*).
	//
	// It is a general algorithm that is fireproof in all circumstances, but it requires the allocation
	// and the construction of a `key => oldIndex` map, and three arrays (one with `newIndex => oldIndex`,
	// the `LIS` and a temporary one to create the LIS).
	//
	// So we cheat where we can: if the tails of the lists are identical, they are guaranteed to be part of
	// the LIS and can be updated without moving them.
	//
	// If two nodes are swapped, they are guaranteed not to be part of the LIS, and must be moved (with
	// the exception of the last node if the list is fully reversed).
	//
	// ## Finding the next sibling.
	//
	// `updateNode()` and `createNode()` expect a nextSibling parameter to perform DOM operations.
	// When the list is being traversed top-down, at any index, the DOM nodes up to the previous
	// vnode reflect the content of the new list, whereas the rest of the DOM nodes reflect the old
	// list. The next sibling must be looked for in the old list using `getNextSibling(... oldStart + 1 ...)`.
	//
	// In the other scenarios (swaps, upwards traversal, map-based diff),
	// the new vnodes list is traversed upwards. The DOM nodes at the bottom of the list reflect the
	// bottom part of the new vnodes list, and we can use the `v.dom`  value of the previous node
	// as the next sibling (cached in the `nextSibling` variable).


	// ## DOM node moves
	//
	// In most scenarios `updateNode()` and `createNode()` perform the DOM operations. However,
	// this is not the case if the node moved (second and fourth part of the diff algo). We move
	// the old DOM nodes before updateNode runs because it enables us to use the cached `nextSibling`
	// variable rather than fetching it using `getNextSibling()`.
	//
	// The fourth part of the diff currently inserts nodes unconditionally, leading to issues
	// like #1791 and #1999. We need to be smarter about those situations where adjascent old
	// nodes remain together in the new list in a way that isn't covered by parts one and
	// three of the diff algo.

	function updateNodes(parent, old, vnodes, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null || old.length === 0) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null || vnodes.length === 0) removeNodes(parent, old, 0, old.length)
		else {
			var isOldKeyed = old[0] != null && old[0].key != null
			var isKeyed = vnodes[0] != null && vnodes[0].key != null
			var start = 0, oldStart = 0
			if (!isOldKeyed) while (oldStart < old.length && old[oldStart] == null) oldStart++
			if (!isKeyed) while (start < vnodes.length && vnodes[start] == null) start++
			if (isKeyed === null && isOldKeyed == null) return // both lists are full of nulls
			if (isOldKeyed !== isKeyed) {
				removeNodes(parent, old, oldStart, old.length)
				createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns)
			} else if (!isKeyed) {
				// Don't index past the end of either list (causes deopts).
				var commonLength = old.length < vnodes.length ? old.length : vnodes.length
				// Rewind if necessary to the first non-null index on either side.
				// We could alternatively either explicitly create or remove nodes when `start !== oldStart`
				// but that would be optimizing for sparse lists which are more rare than dense ones.
				start = start < oldStart ? start : oldStart
				for (; start < commonLength; start++) {
					o = old[start]
					v = vnodes[start]
					if (o === v || o == null && v == null) continue
					else if (o == null) createNode(parent, v, hooks, ns, getNextSibling(old, start + 1, nextSibling))
					else if (v == null) removeNode(parent, o)
					else updateNode(parent, o, v, hooks, getNextSibling(old, start + 1, nextSibling), ns)
				}
				if (old.length > commonLength) removeNodes(parent, old, start, old.length)
				if (vnodes.length > commonLength) createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns)
			} else {
				// keyed diff
				var oldEnd = old.length - 1, end = vnodes.length - 1, map, o, v, oe, ve, topSibling

				// bottom-up
				while (oldEnd >= oldStart && end >= start) {
					oe = old[oldEnd]
					ve = vnodes[end]
					if (oe.key !== ve.key) break
					if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldEnd--, end--
				}
				// top-down
				while (oldEnd >= oldStart && end >= start) {
					o = old[oldStart]
					v = vnodes[start]
					if (o.key !== v.key) break
					oldStart++, start++
					if (o !== v) updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), ns)
				}
				// swaps and list reversals
				while (oldEnd >= oldStart && end >= start) {
					if (start === end) break
					if (o.key !== ve.key || oe.key !== v.key) break
					topSibling = getNextSibling(old, oldStart, nextSibling)
					moveNodes(parent, oe, topSibling)
					if (oe !== v) updateNode(parent, oe, v, hooks, topSibling, ns)
					if (++start <= --end) moveNodes(parent, o, nextSibling)
					if (o !== ve) updateNode(parent, o, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldStart++; oldEnd--
					oe = old[oldEnd]
					ve = vnodes[end]
					o = old[oldStart]
					v = vnodes[start]
				}
				// bottom up once again
				while (oldEnd >= oldStart && end >= start) {
					if (oe.key !== ve.key) break
					if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldEnd--, end--
					oe = old[oldEnd]
					ve = vnodes[end]
				}
				if (start > end) removeNodes(parent, old, oldStart, oldEnd + 1)
				else if (oldStart > oldEnd) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
				else {
					// inspired by ivi https://github.com/ivijs/ivi/ by Boris Kaul
					var originalNextSibling = nextSibling, vnodesLength = end - start + 1, oldIndices = new Array(vnodesLength), li=0, i=0, pos = 2147483647, matched = 0, map, lisIndices
					for (i = 0; i < vnodesLength; i++) oldIndices[i] = -1
					for (i = end; i >= start; i--) {
						if (map == null) map = getKeyMap(old, oldStart, oldEnd + 1)
						ve = vnodes[i]
						var oldIndex = map[ve.key]
						if (oldIndex != null) {
							pos = (oldIndex < pos) ? oldIndex : -1 // becomes -1 if nodes were re-ordered
							oldIndices[i-start] = oldIndex
							oe = old[oldIndex]
							old[oldIndex] = null
							if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
							if (ve.dom != null) nextSibling = ve.dom
							matched++
						}
					}
					nextSibling = originalNextSibling
					if (matched !== oldEnd - oldStart + 1) removeNodes(parent, old, oldStart, oldEnd + 1)
					if (matched === 0) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
					else {
						if (pos === -1) {
							// the indices of the indices of the items that are part of the
							// longest increasing subsequence in the oldIndices list
							lisIndices = makeLisIndices(oldIndices)
							li = lisIndices.length - 1
							for (i = end; i >= start; i--) {
								v = vnodes[i]
								if (oldIndices[i-start] === -1) createNode(parent, v, hooks, ns, nextSibling)
								else {
									if (lisIndices[li] === i - start) li--
									else moveNodes(parent, v, nextSibling)
								}
								if (v.dom != null) nextSibling = vnodes[i].dom
							}
						} else {
							for (i = end; i >= start; i--) {
								v = vnodes[i]
								if (oldIndices[i-start] === -1) createNode(parent, v, hooks, ns, nextSibling)
								if (v.dom != null) nextSibling = vnodes[i].dom
							}
						}
					}
				}
			}
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode.events = old.events
			if (shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, ns, nextSibling); break
					case "[": updateFragment(parent, old, vnode, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, ns)
		}
		else {
			removeNode(parent, old)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, ns, nextSibling) {
		if (old.children !== vnode.children) {
			removeHTML(parent, old)
			createHTML(parent, vnode, ns, nextSibling)
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
		}
	}
	function updateFragment(parent, old, vnode, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns

		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (!maybeSetContentEditable(vnode)) {
			if (old.text != null && vnode.text != null && vnode.text !== "") {
				if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
			}
			else {
				if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
				if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
				updateNodes(element, old.children, vnode.children, hooks, null, ns)
			}
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, ns) {
		vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		updateLifecycle(vnode.state, vnode, hooks)
		if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(parent, old.instance)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function getKeyMap(vnodes, start, end) {
		var map = Object.create(null)
		for (; start < end; start++) {
			var vnode = vnodes[start]
			if (vnode != null) {
				var key = vnode.key
				if (key != null) map[key] = start
			}
		}
		return map
	}
	// Lifted from ivi https://github.com/ivijs/ivi/
	// takes a list of unique numbers (-1 is special and can
	// occur multiple times) and returns an array with the indices
	// of the items that are part of the longest increasing
	// subsequece
	var lisTemp = []
	function makeLisIndices(a) {
		var result = [0]
		var u = 0, v = 0, i = 0
		var il = lisTemp.length = a.length
		for (var i = 0; i < il; i++) lisTemp[i] = a[i]
		for (var i = 0; i < il; ++i) {
			if (a[i] === -1) continue
			var j = result[result.length - 1]
			if (a[j] < a[i]) {
				lisTemp[i] = j
				result.push(i)
				continue
			}
			u = 0
			v = result.length - 1
			while (u < v) {
				// Fast integer average without overflow.
				// eslint-disable-next-line no-bitwise
				var c = (u >>> 1) + (v >>> 1) + (u & v & 1)
				if (a[result[c]] < a[i]) {
					u = c + 1
				}
				else {
					v = c
				}
			}
			if (a[i] < a[result[u]]) {
				if (u > 0) lisTemp[i] = result[u - 1]
				result[u] = i
			}
		}
		u = result.length
		v = result[u - 1]
		while (u-- > 0) {
			result[u] = v
			v = lisTemp[v]
		}
		lisTemp.length = 0
		return result
	}

	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}

	// This covers a really specific edge case:
	// - Parent node is keyed and contains child
	// - Child is removed, returns unresolved promise in `onbeforeremove`
	// - Parent node is moved in keyed diff
	// - Remaining children still need moved appropriately
	//
	// Ideally, I'd track removed nodes as well, but that introduces a lot more
	// complexity and I'm not exactly interested in doing that.
	function moveNodes(parent, vnode, nextSibling) {
		var frag = $doc.createDocumentFragment()
		moveChildToFrag(parent, frag, vnode)
		insertNode(parent, frag, nextSibling)
	}
	function moveChildToFrag(parent, frag, vnode) {
		// Dodge the recursion overhead in a few of the most common cases.
		while (vnode.dom != null && vnode.dom.parentNode === parent) {
			if (typeof vnode.tag !== "string") {
				vnode = vnode.instance
				if (vnode != null) continue
			} else if (vnode.tag === "<") {
				for (var i = 0; i < vnode.instance.length; i++) {
					frag.appendChild(vnode.instance[i])
				}
			} else if (vnode.tag !== "[") {
				// Don't recurse for text nodes *or* elements, just fragments
				frag.appendChild(vnode.dom)
			} else if (vnode.children.length === 1) {
				vnode = vnode.children[0]
				if (vnode != null) continue
			} else {
				for (var i = 0; i < vnode.children.length; i++) {
					var child = vnode.children[i]
					if (child != null) moveChildToFrag(parent, frag, child)
				}
			}
			break
		}
	}

	function insertNode(parent, dom, nextSibling) {
		if (nextSibling != null) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}

	function maybeSetContentEditable(vnode) {
		if (vnode.attrs == null || (
			vnode.attrs.contenteditable == null && // attribute
			vnode.attrs.contentEditable == null // property
		)) return false
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
		return true
	}

	//remove
	function removeNodes(parent, vnodes, start, end) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) removeNode(parent, vnode)
		}
	}
	function removeNode(parent, vnode) {
		var mask = 0
		var original = vnode.state
		var stateResult, attrsResult
		if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeremove === "function") {
			var result = callHook.call(vnode.state.onbeforeremove, vnode)
			if (result != null && typeof result.then === "function") {
				mask = 1
				stateResult = result
			}
		}
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = callHook.call(vnode.attrs.onbeforeremove, vnode)
			if (result != null && typeof result.then === "function") {
				// eslint-disable-next-line no-bitwise
				mask |= 2
				attrsResult = result
			}
		}
		checkState(vnode, original)

		// If we can, try to fast-path it and avoid all the overhead of awaiting
		if (!mask) {
			onremove(vnode)
			removeChild(parent, vnode)
		} else {
			if (stateResult != null) {
				var next = function () {
					// eslint-disable-next-line no-bitwise
					if (mask & 1) { mask &= 2; if (!mask) reallyRemove() }
				}
				stateResult.then(next, next)
			}
			if (attrsResult != null) {
				var next = function () {
					// eslint-disable-next-line no-bitwise
					if (mask & 2) { mask &= 1; if (!mask) reallyRemove() }
				}
				attrsResult.then(next, next)
			}
		}

		function reallyRemove() {
			checkState(vnode, original)
			onremove(vnode)
			removeChild(parent, vnode)
		}
	}
	function removeHTML(parent, vnode) {
		for (var i = 0; i < vnode.instance.length; i++) {
			parent.removeChild(vnode.instance[i])
		}
	}
	function removeChild(parent, vnode) {
		// Dodge the recursion overhead in a few of the most common cases.
		while (vnode.dom != null && vnode.dom.parentNode === parent) {
			if (typeof vnode.tag !== "string") {
				vnode = vnode.instance
				if (vnode != null) continue
			} else if (vnode.tag === "<") {
				removeHTML(parent, vnode)
			} else {
				if (vnode.tag !== "[") {
					parent.removeChild(vnode.dom)
					if (!Array.isArray(vnode.children)) break
				}
				if (vnode.children.length === 1) {
					vnode = vnode.children[0]
					if (vnode != null) continue
				} else {
					for (var i = 0; i < vnode.children.length; i++) {
						var child = vnode.children[i]
						if (child != null) removeChild(parent, child)
					}
				}
			}
			break
		}
	}
	function onremove(vnode) {
		if (typeof vnode.tag !== "string" && typeof vnode.state.onremove === "function") callHook.call(vnode.state.onremove, vnode)
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") callHook.call(vnode.attrs.onremove, vnode)
		if (typeof vnode.tag !== "string") {
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}

	//attrs
	function setAttrs(vnode, attrs, ns) {
		for (var key in attrs) {
			setAttr(vnode, key, null, attrs[key], ns)
		}
	}
	function setAttr(vnode, key, old, value, ns) {
		if (key === "key" || key === "is" || value == null || isLifecycleMethod(key) || (old === value && !isFormAttribute(vnode, key)) && typeof value !== "object") return
		if (key[0] === "o" && key[1] === "n") return updateEvent(vnode, key, value)
		if (key.slice(0, 6) === "xlink:") vnode.dom.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(6), value)
		else if (key === "style") updateStyle(vnode.dom, old, value)
		else if (hasPropertyKey(vnode, key, ns)) {
			if (key === "value") {
				// Only do the coercion if we're actually going to check the value.
				/* eslint-disable no-implicit-coercion */
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === "" + value && vnode.dom === activeElement()) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select" && old !== null && vnode.dom.value === "" + value) return
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old !== null && vnode.dom.value === "" + value) return
				/* eslint-enable no-implicit-coercion */
			}
			// If you assign an input type that is not supported by IE 11 with an assignment expression, an error will occur.
			if (vnode.tag === "input" && key === "type") vnode.dom.setAttribute(key, value)
			else vnode.dom[key] = value
		} else {
			if (typeof value === "boolean") {
				if (value) vnode.dom.setAttribute(key, "")
				else vnode.dom.removeAttribute(key)
			}
			else vnode.dom.setAttribute(key === "className" ? "class" : key, value)
		}
	}
	function removeAttr(vnode, key, old, ns) {
		if (key === "key" || key === "is" || old == null || isLifecycleMethod(key)) return
		if (key[0] === "o" && key[1] === "n" && !isLifecycleMethod(key)) updateEvent(vnode, key, undefined)
		else if (key === "style") updateStyle(vnode.dom, old, null)
		else if (
			hasPropertyKey(vnode, key, ns)
			&& key !== "className"
			&& !(key === "value" && (
				vnode.tag === "option"
				|| vnode.tag === "select" && vnode.dom.selectedIndex === -1 && vnode.dom === activeElement()
			))
			&& !(vnode.tag === "input" && key === "type")
		) {
			vnode.dom[key] = null
		} else {
			var nsLastIndex = key.indexOf(":")
			if (nsLastIndex !== -1) key = key.slice(nsLastIndex + 1)
			if (old !== false) vnode.dom.removeAttribute(key === "className" ? "class" : key)
		}
	}
	function setLateSelectAttrs(vnode, attrs) {
		if ("value" in attrs) {
			if(attrs.value === null) {
				if (vnode.dom.selectedIndex !== -1) vnode.dom.value = null
			} else {
				var normalized = "" + attrs.value // eslint-disable-line no-implicit-coercion
				if (vnode.dom.value !== normalized || vnode.dom.selectedIndex === -1) {
					vnode.dom.value = normalized
				}
			}
		}
		if ("selectedIndex" in attrs) setAttr(vnode, "selectedIndex", null, attrs.selectedIndex, undefined)
	}
	function updateAttrs(vnode, old, attrs, ns) {
		if (attrs != null) {
			for (var key in attrs) {
				setAttr(vnode, key, old && old[key], attrs[key], ns)
			}
		}
		var val
		if (old != null) {
			for (var key in old) {
				if (((val = old[key]) != null) && (attrs == null || attrs[key] == null)) {
					removeAttr(vnode, key, val, ns)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === activeElement() || vnode.tag === "option" && vnode.dom.parentNode === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function hasPropertyKey(vnode, key, ns) {
		// Filter out namespaced keys
		return ns === undefined && (
			// If it's a custom element, just keep it.
			vnode.tag.indexOf("-") > -1 || vnode.attrs != null && vnode.attrs.is ||
			// If it's a normal element, let's try to avoid a few browser bugs.
			key !== "href" && key !== "list" && key !== "form" && key !== "width" && key !== "height"// && key !== "type"
			// Defer the property check until *after* we check everything.
		) && key in vnode.dom
	}

	//style
	var uppercaseRegex = /[A-Z]/g
	function toLowerCase(capital) { return "-" + capital.toLowerCase() }
	function normalizeKey(key) {
		return key[0] === "-" && key[1] === "-" ? key :
			key === "cssFloat" ? "float" :
				key.replace(uppercaseRegex, toLowerCase)
	}
	function updateStyle(element, old, style) {
		if (old === style) {
			// Styles are equivalent, do nothing.
		} else if (style == null) {
			// New style is missing, just clear it.
			element.style.cssText = ""
		} else if (typeof style !== "object") {
			// New style is a string, let engine deal with patching.
			element.style.cssText = style
		} else if (old == null || typeof old !== "object") {
			// `old` is missing or a string, `style` is an object.
			element.style.cssText = ""
			// Add new style properties
			for (var key in style) {
				var value = style[key]
				if (value != null) element.style.setProperty(normalizeKey(key), String(value))
			}
		} else {
			// Both old & new are (different) objects.
			// Update style properties that have changed
			for (var key in style) {
				var value = style[key]
				if (value != null && (value = String(value)) !== String(old[key])) {
					element.style.setProperty(normalizeKey(key), value)
				}
			}
			// Remove style properties that no longer exist
			for (var key in old) {
				if (old[key] != null && style[key] == null) {
					element.style.removeProperty(normalizeKey(key))
				}
			}
		}
	}

	// Here's an explanation of how this works:
	// 1. The event names are always (by design) prefixed by `on`.
	// 2. The EventListener interface accepts either a function or an object
	//    with a `handleEvent` method.
	// 3. The object does not inherit from `Object.prototype`, to avoid
	//    any potential interference with that (e.g. setters).
	// 4. The event name is remapped to the handler before calling it.
	// 5. In function-based event handlers, `ev.target === this`. We replicate
	//    that below.
	// 6. In function-based event handlers, `return false` prevents the default
	//    action and stops event propagation. We replicate that below.
	function EventDict() {
		// Save this, so the current redraw is correctly tracked.
		this._ = currentRedraw
	}
	EventDict.prototype = Object.create(null)
	EventDict.prototype.handleEvent = function (ev) {
		var handler = this["on" + ev.type]
		var result
		if (typeof handler === "function") result = handler.call(ev.currentTarget, ev)
		else if (typeof handler.handleEvent === "function") handler.handleEvent(ev)
		if (this._ && ev.redraw !== false) (0, this._)()
		if (result === false) {
			ev.preventDefault()
			ev.stopPropagation()
		}
	}

	//event
	function updateEvent(vnode, key, value) {
		if (vnode.events != null) {
			if (vnode.events[key] === value) return
			if (value != null && (typeof value === "function" || typeof value === "object")) {
				if (vnode.events[key] == null) vnode.dom.addEventListener(key.slice(2), vnode.events, false)
				vnode.events[key] = value
			} else {
				if (vnode.events[key] != null) vnode.dom.removeEventListener(key.slice(2), vnode.events, false)
				vnode.events[key] = undefined
			}
		} else if (value != null && (typeof value === "function" || typeof value === "object")) {
			vnode.events = new EventDict()
			vnode.dom.addEventListener(key.slice(2), vnode.events, false)
			vnode.events[key] = value
		}
	}

	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") callHook.call(source.oninit, vnode)
		if (typeof source.oncreate === "function") hooks.push(callHook.bind(source.oncreate, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(callHook.bind(source.onupdate, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		do {
			if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") {
				var force = callHook.call(vnode.attrs.onbeforeupdate, vnode, old)
				if (force !== undefined && !force) break
			}
			if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeupdate === "function") {
				var force = callHook.call(vnode.state.onbeforeupdate, vnode, old)
				if (force !== undefined && !force) break
			}
			return false
		} while (false); // eslint-disable-line no-constant-condition
		vnode.dom = old.dom
		vnode.domSize = old.domSize
		vnode.instance = old.instance
		// One would think having the actual latest attributes would be ideal,
		// but it doesn't let us properly diff based on our current internal
		// representation. We have to save not only the old DOM info, but also
		// the attributes used to create it, as we diff *that*, not against the
		// DOM directly (with a few exceptions in `setAttr`). And, of course, we
		// need to save the children and text as they are conceptually not
		// unlike special "attributes" internally.
		vnode.attrs = old.attrs
		vnode.children = old.children
		vnode.text = old.text
		return true
	}

	return function(dom, vnodes, redraw) {
		if (!dom) throw new TypeError("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = activeElement()
		var namespace = dom.namespaceURI

		// First time rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""

		vnodes = Vnode.normalizeChildren(Array.isArray(vnodes) ? vnodes : [vnodes])
		var prevRedraw = currentRedraw
		try {
			currentRedraw = typeof redraw === "function" ? redraw : undefined
			updateNodes(dom, dom.vnodes, vnodes, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		} finally {
			currentRedraw = prevRedraw
		}
		dom.vnodes = vnodes
		// `document.activeElement` can return null: https://html.spec.whatwg.org/multipage/interaction.html#dom-document-activeelement
		if (active != null && activeElement() !== active && typeof active.focus === "function") active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
}

},{"../render/vnode":"../node_modules/mithril/render/vnode.js"}],"../node_modules/mithril/render.js":[function(require,module,exports) {
"use strict"

module.exports = require("./render/render")(window)

},{"./render/render":"../node_modules/mithril/render/render.js"}],"../node_modules/mithril/api/mount-redraw.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")

module.exports = function(render, schedule, console) {
	var subscriptions = []
	var rendering = false
	var pending = false

	function sync() {
		if (rendering) throw new Error("Nested m.redraw.sync() call")
		rendering = true
		for (var i = 0; i < subscriptions.length; i += 2) {
			try { render(subscriptions[i], Vnode(subscriptions[i + 1]), redraw) }
			catch (e) { console.error(e) }
		}
		rendering = false
	}

	function redraw() {
		if (!pending) {
			pending = true
			schedule(function() {
				pending = false
				sync()
			})
		}
	}

	redraw.sync = sync

	function mount(root, component) {
		if (component != null && component.view == null && typeof component !== "function") {
			throw new TypeError("m.mount(element, component) expects a component, not a vnode")
		}

		var index = subscriptions.indexOf(root)
		if (index >= 0) {
			subscriptions.splice(index, 2)
			render(root, [], redraw)
		}

		if (component != null) {
			subscriptions.push(root, component)
			render(root, Vnode(component), redraw)
		}
	}

	return {mount: mount, redraw: redraw}
}

},{"../render/vnode":"../node_modules/mithril/render/vnode.js"}],"../node_modules/mithril/mount-redraw.js":[function(require,module,exports) {
"use strict"

var render = require("./render")

module.exports = require("./api/mount-redraw")(render, requestAnimationFrame, console)

},{"./render":"../node_modules/mithril/render.js","./api/mount-redraw":"../node_modules/mithril/api/mount-redraw.js"}],"../node_modules/mithril/querystring/build.js":[function(require,module,exports) {
"use strict"

module.exports = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""

	var args = []
	for (var key in object) {
		destructure(key, object[key])
	}

	return args.join("&")

	function destructure(key, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}

},{}],"../node_modules/mithril/pathname/assign.js":[function(require,module,exports) {
"use strict"

module.exports = Object.assign || function(target, source) {
	if(source) Object.keys(source).forEach(function(key) { target[key] = source[key] })
}

},{}],"../node_modules/mithril/pathname/build.js":[function(require,module,exports) {
"use strict"

var buildQueryString = require("../querystring/build")
var assign = require("./assign")

// Returns `path` from `template` + `params`
module.exports = function(template, params) {
	if ((/:([^\/\.-]+)(\.{3})?:/).test(template)) {
		throw new SyntaxError("Template parameter names *must* be separated")
	}
	if (params == null) return template
	var queryIndex = template.indexOf("?")
	var hashIndex = template.indexOf("#")
	var queryEnd = hashIndex < 0 ? template.length : hashIndex
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex
	var path = template.slice(0, pathEnd)
	var query = {}

	assign(query, params)

	var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function(m, key, variadic) {
		delete query[key]
		// If no such parameter exists, don't interpolate it.
		if (params[key] == null) return m
		// Escape normal parameters, but not variadic ones.
		return variadic ? params[key] : encodeURIComponent(String(params[key]))
	})

	// In case the template substitution adds new query/hash parameters.
	var newQueryIndex = resolved.indexOf("?")
	var newHashIndex = resolved.indexOf("#")
	var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex
	var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex
	var result = resolved.slice(0, newPathEnd)

	if (queryIndex >= 0) result += template.slice(queryIndex, queryEnd)
	if (newQueryIndex >= 0) result += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd)
	var querystring = buildQueryString(query)
	if (querystring) result += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring
	if (hashIndex >= 0) result += template.slice(hashIndex)
	if (newHashIndex >= 0) result += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex)
	return result
}

},{"../querystring/build":"../node_modules/mithril/querystring/build.js","./assign":"../node_modules/mithril/pathname/assign.js"}],"../node_modules/mithril/request/request.js":[function(require,module,exports) {
"use strict"

var buildPathname = require("../pathname/build")

module.exports = function($window, Promise, oncompletion) {
	var callbackCount = 0

	function PromiseProxy(executor) {
		return new Promise(executor)
	}

	// In case the global Promise is some userland library's where they rely on
	// `foo instanceof this.constructor`, `this.constructor.resolve(value)`, or
	// similar. Let's *not* break them.
	PromiseProxy.prototype = Promise.prototype
	PromiseProxy.__proto__ = Promise // eslint-disable-line no-proto

	function makeRequest(factory) {
		return function(url, args) {
			if (typeof url !== "string") { args = url; url = url.url }
			else if (args == null) args = {}
			var promise = new Promise(function(resolve, reject) {
				factory(buildPathname(url, args.params), args, function (data) {
					if (typeof args.type === "function") {
						if (Array.isArray(data)) {
							for (var i = 0; i < data.length; i++) {
								data[i] = new args.type(data[i])
							}
						}
						else data = new args.type(data)
					}
					resolve(data)
				}, reject)
			})
			if (args.background === true) return promise
			var count = 0
			function complete() {
				if (--count === 0 && typeof oncompletion === "function") oncompletion()
			}

			return wrap(promise)

			function wrap(promise) {
				var then = promise.then
				// Set the constructor, so engines know to not await or resolve
				// this as a native promise. At the time of writing, this is
				// only necessary for V8, but their behavior is the correct
				// behavior per spec. See this spec issue for more details:
				// https://github.com/tc39/ecma262/issues/1577. Also, see the
				// corresponding comment in `request/tests/test-request.js` for
				// a bit more background on the issue at hand.
				promise.constructor = PromiseProxy
				promise.then = function() {
					count++
					var next = then.apply(promise, arguments)
					next.then(complete, function(e) {
						complete()
						if (count === 0) throw e
					})
					return wrap(next)
				}
				return promise
			}
		}
	}

	function hasHeader(args, name) {
		for (var key in args.headers) {
			if ({}.hasOwnProperty.call(args.headers, key) && name.test(key)) return true
		}
		return false
	}

	return {
		request: makeRequest(function(url, args, resolve, reject) {
			var method = args.method != null ? args.method.toUpperCase() : "GET"
			var body = args.body
			var assumeJSON = (args.serialize == null || args.serialize === JSON.serialize) && !(body instanceof $window.FormData)
			var responseType = args.responseType || (typeof args.extract === "function" ? "" : "json")

			var xhr = new $window.XMLHttpRequest(), aborted = false
			var original = xhr, replacedAbort
			var abort = xhr.abort

			xhr.abort = function() {
				aborted = true
				abort.call(this)
			}

			xhr.open(method, url, args.async !== false, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)

			if (assumeJSON && body != null && !hasHeader(args, /^content-type$/i)) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (typeof args.deserialize !== "function" && !hasHeader(args, /^accept$/i)) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			if (args.timeout) xhr.timeout = args.timeout
			xhr.responseType = responseType

			for (var key in args.headers) {
				if ({}.hasOwnProperty.call(args.headers, key)) {
					xhr.setRequestHeader(key, args.headers[key])
				}
			}

			xhr.onreadystatechange = function(ev) {
				// Don't throw errors on xhr.abort().
				if (aborted) return

				if (ev.target.readyState === 4) {
					try {
						var success = (ev.target.status >= 200 && ev.target.status < 300) || ev.target.status === 304 || (/^file:\/\//i).test(url)
						// When the response type isn't "" or "text",
						// `xhr.responseText` is the wrong thing to use.
						// Browsers do the right thing and throw here, and we
						// should honor that and do the right thing by
						// preferring `xhr.response` where possible/practical.
						var response = ev.target.response, message

						if (responseType === "json") {
							// For IE and Edge, which don't implement
							// `responseType: "json"`.
							if (!ev.target.responseType && typeof args.extract !== "function") response = JSON.parse(ev.target.responseText)
						} else if (!responseType || responseType === "text") {
							// Only use this default if it's text. If a parsed
							// document is needed on old IE and friends (all
							// unsupported), the user should use a custom
							// `config` instead. They're already using this at
							// their own risk.
							if (response == null) response = ev.target.responseText
						}

						if (typeof args.extract === "function") {
							response = args.extract(ev.target, args)
							success = true
						} else if (typeof args.deserialize === "function") {
							response = args.deserialize(response)
						}
						if (success) resolve(response)
						else {
							try { message = ev.target.responseText }
							catch (e) { message = response }
							var error = new Error(message)
							error.code = ev.target.status
							error.response = response
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}

			if (typeof args.config === "function") {
				xhr = args.config(xhr, args, url) || xhr

				// Propagate the `abort` to any replacement XHR as well.
				if (xhr !== original) {
					replacedAbort = xhr.abort
					xhr.abort = function() {
						aborted = true
						replacedAbort.call(this)
					}
				}
			}

			if (body == null) xhr.send()
			else if (typeof args.serialize === "function") xhr.send(args.serialize(body))
			else if (body instanceof $window.FormData) xhr.send(body)
			else xhr.send(JSON.stringify(body))
		}),
		jsonp: makeRequest(function(url, args, resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				delete $window[callbackName]
				script.parentNode.removeChild(script)
				resolve(data)
			}
			script.onerror = function() {
				delete $window[callbackName]
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
			}
			script.src = url + (url.indexOf("?") < 0 ? "?" : "&") +
				encodeURIComponent(args.callbackKey || "callback") + "=" +
				encodeURIComponent(callbackName)
			$window.document.documentElement.appendChild(script)
		}),
	}
}

},{"../pathname/build":"../node_modules/mithril/pathname/build.js"}],"../node_modules/mithril/request.js":[function(require,module,exports) {
"use strict"

var PromisePolyfill = require("./promise/promise")
var mountRedraw = require("./mount-redraw")

module.exports = require("./request/request")(window, PromisePolyfill, mountRedraw.redraw)

},{"./promise/promise":"../node_modules/mithril/promise/promise.js","./mount-redraw":"../node_modules/mithril/mount-redraw.js","./request/request":"../node_modules/mithril/request/request.js"}],"../node_modules/mithril/querystring/parse.js":[function(require,module,exports) {
"use strict"

module.exports = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)

	var entries = string.split("&"), counters = {}, data = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""

		if (value === "true") value = true
		else if (value === "false") value = false

		var levels = key.split(/\]\[?|\[/)
		var cursor = data
		if (key.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			if (level === "") {
				var key = levels.slice(0, j).join()
				if (counters[key] == null) {
					counters[key] = Array.isArray(cursor) ? cursor.length : 0
				}
				level = counters[key]++
			}
			// Disallow direct prototype pollution
			else if (level === "__proto__") break
			if (j === levels.length - 1) cursor[level] = value
			else {
				// Read own properties exclusively to disallow indirect
				// prototype pollution
				var desc = Object.getOwnPropertyDescriptor(cursor, level)
				if (desc != null) desc = desc.value
				if (desc == null) cursor[level] = desc = isNumber ? [] : {}
				cursor = desc
			}
		}
	}
	return data
}

},{}],"../node_modules/mithril/pathname/parse.js":[function(require,module,exports) {
"use strict"

var parseQueryString = require("../querystring/parse")

// Returns `{path, params}` from `url`
module.exports = function(url) {
	var queryIndex = url.indexOf("?")
	var hashIndex = url.indexOf("#")
	var queryEnd = hashIndex < 0 ? url.length : hashIndex
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex
	var path = url.slice(0, pathEnd).replace(/\/{2,}/g, "/")

	if (!path) path = "/"
	else {
		if (path[0] !== "/") path = "/" + path
		if (path.length > 1 && path[path.length - 1] === "/") path = path.slice(0, -1)
	}
	return {
		path: path,
		params: queryIndex < 0
			? {}
			: parseQueryString(url.slice(queryIndex + 1, queryEnd)),
	}
}

},{"../querystring/parse":"../node_modules/mithril/querystring/parse.js"}],"../node_modules/mithril/pathname/compileTemplate.js":[function(require,module,exports) {
"use strict"

var parsePathname = require("./parse")

// Compiles a template into a function that takes a resolved path (without query
// strings) and returns an object containing the template parameters with their
// parsed values. This expects the input of the compiled template to be the
// output of `parsePathname`. Note that it does *not* remove query parameters
// specified in the template.
module.exports = function(template) {
	var templateData = parsePathname(template)
	var templateKeys = Object.keys(templateData.params)
	var keys = []
	var regexp = new RegExp("^" + templateData.path.replace(
		// I escape literal text so people can use things like `:file.:ext` or
		// `:lang-:locale` in routes. This is all merged into one pass so I
		// don't also accidentally escape `-` and make it harder to detect it to
		// ban it from template parameters.
		/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,
		function(m, key, extra) {
			if (key == null) return "\\" + m
			keys.push({k: key, r: extra === "..."})
			if (extra === "...") return "(.*)"
			if (extra === ".") return "([^/]+)\\."
			return "([^/]+)" + (extra || "")
		}
	) + "$")
	return function(data) {
		// First, check the params. Usually, there isn't any, and it's just
		// checking a static set.
		for (var i = 0; i < templateKeys.length; i++) {
			if (templateData.params[templateKeys[i]] !== data.params[templateKeys[i]]) return false
		}
		// If no interpolations exist, let's skip all the ceremony
		if (!keys.length) return regexp.test(data.path)
		var values = regexp.exec(data.path)
		if (values == null) return false
		for (var i = 0; i < keys.length; i++) {
			data.params[keys[i].k] = keys[i].r ? values[i + 1] : decodeURIComponent(values[i + 1])
		}
		return true
	}
}

},{"./parse":"../node_modules/mithril/pathname/parse.js"}],"../node_modules/mithril/api/router.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")
var m = require("../render/hyperscript")
var Promise = require("../promise/promise")

var buildPathname = require("../pathname/build")
var parsePathname = require("../pathname/parse")
var compileTemplate = require("../pathname/compileTemplate")
var assign = require("../pathname/assign")

var sentinel = {}

module.exports = function($window, mountRedraw) {
	var fireAsync

	function setPath(path, data, options) {
		path = buildPathname(path, data)
		if (fireAsync != null) {
			fireAsync()
			var state = options ? options.state : null
			var title = options ? options.title : null
			if (options && options.replace) $window.history.replaceState(state, title, route.prefix + path)
			else $window.history.pushState(state, title, route.prefix + path)
		}
		else {
			$window.location.href = route.prefix + path
		}
	}

	var currentResolver = sentinel, component, attrs, currentPath, lastUpdate

	var SKIP = route.SKIP = {}

	function route(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		// 0 = start
		// 1 = init
		// 2 = ready
		var state = 0

		var compiled = Object.keys(routes).map(function(route) {
			if (route[0] !== "/") throw new SyntaxError("Routes must start with a `/`")
			if ((/:([^\/\.-]+)(\.{3})?:/).test(route)) {
				throw new SyntaxError("Route parameter names must be separated with either `/`, `.`, or `-`")
			}
			return {
				route: route,
				component: routes[route],
				check: compileTemplate(route),
			}
		})
		var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
		var p = Promise.resolve()
		var scheduled = false
		var onremove

		fireAsync = null

		if (defaultRoute != null) {
			var defaultData = parsePathname(defaultRoute)

			if (!compiled.some(function (i) { return i.check(defaultData) })) {
				throw new ReferenceError("Default route doesn't match any known routes")
			}
		}

		function resolveRoute() {
			scheduled = false
			// Consider the pathname holistically. The prefix might even be invalid,
			// but that's not our problem.
			var prefix = $window.location.hash
			if (route.prefix[0] !== "#") {
				prefix = $window.location.search + prefix
				if (route.prefix[0] !== "?") {
					prefix = $window.location.pathname + prefix
					if (prefix[0] !== "/") prefix = "/" + prefix
				}
			}
			// This seemingly useless `.concat()` speeds up the tests quite a bit,
			// since the representation is consistently a relatively poorly
			// optimized cons string.
			var path = prefix.concat()
				.replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
				.slice(route.prefix.length)
			var data = parsePathname(path)

			assign(data.params, $window.history.state)

			function fail() {
				if (path === defaultRoute) throw new Error("Could not resolve default route " + defaultRoute)
				setPath(defaultRoute, null, {replace: true})
			}

			loop(0)
			function loop(i) {
				// 0 = init
				// 1 = scheduled
				// 2 = done
				for (; i < compiled.length; i++) {
					if (compiled[i].check(data)) {
						var payload = compiled[i].component
						var matchedRoute = compiled[i].route
						var localComp = payload
						var update = lastUpdate = function(comp) {
							if (update !== lastUpdate) return
							if (comp === SKIP) return loop(i + 1)
							component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
							attrs = data.params, currentPath = path, lastUpdate = null
							currentResolver = payload.render ? payload : null
							if (state === 2) mountRedraw.redraw()
							else {
								state = 2
								mountRedraw.redraw.sync()
							}
						}
						// There's no understating how much I *wish* I could
						// use `async`/`await` here...
						if (payload.view || typeof payload === "function") {
							payload = {}
							update(localComp)
						}
						else if (payload.onmatch) {
							p.then(function () {
								return payload.onmatch(data.params, path, matchedRoute)
							}).then(update, fail)
						}
						else update("div")
						return
					}
				}
				fail()
			}
		}

		// Set it unconditionally so `m.route.set` and `m.route.Link` both work,
		// even if neither `pushState` nor `hashchange` are supported. It's
		// cleared if `hashchange` is used, since that makes it automatically
		// async.
		fireAsync = function() {
			if (!scheduled) {
				scheduled = true
				callAsync(resolveRoute)
			}
		}

		if (typeof $window.history.pushState === "function") {
			onremove = function() {
				$window.removeEventListener("popstate", fireAsync, false)
			}
			$window.addEventListener("popstate", fireAsync, false)
		} else if (route.prefix[0] === "#") {
			fireAsync = null
			onremove = function() {
				$window.removeEventListener("hashchange", resolveRoute, false)
			}
			$window.addEventListener("hashchange", resolveRoute, false)
		}

		return mountRedraw.mount(root, {
			onbeforeupdate: function() {
				state = state ? 2 : 1
				return !(!state || sentinel === currentResolver)
			},
			oncreate: resolveRoute,
			onremove: onremove,
			view: function() {
				if (!state || sentinel === currentResolver) return
				// Wrap in a fragment to preserve existing key semantics
				var vnode = [Vnode(component, attrs.key, attrs)]
				if (currentResolver) vnode = currentResolver.render(vnode[0])
				return vnode
			},
		})
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = "#!"
	route.Link = {
		view: function(vnode) {
			var options = vnode.attrs.options
			// Remove these so they don't get overwritten
			var attrs = {}, onclick, href
			assign(attrs, vnode.attrs)
			// The first two are internal, but the rest are magic attributes
			// that need censored to not screw up rendering.
			attrs.selector = attrs.options = attrs.key = attrs.oninit =
			attrs.oncreate = attrs.onbeforeupdate = attrs.onupdate =
			attrs.onbeforeremove = attrs.onremove = null

			// Do this now so we can get the most current `href` and `disabled`.
			// Those attributes may also be specified in the selector, and we
			// should honor that.
			var child = m(vnode.attrs.selector || "a", attrs, vnode.children)

			// Let's provide a *right* way to disable a route link, rather than
			// letting people screw up accessibility on accident.
			//
			// The attribute is coerced so users don't get surprised over
			// `disabled: 0` resulting in a button that's somehow routable
			// despite being visibly disabled.
			if (child.attrs.disabled = Boolean(child.attrs.disabled)) {
				child.attrs.href = null
				child.attrs["aria-disabled"] = "true"
				// If you *really* do want to do this on a disabled link, use
				// an `oncreate` hook to add it.
				child.attrs.onclick = null
			} else {
				onclick = child.attrs.onclick
				href = child.attrs.href
				child.attrs.href = route.prefix + href
				child.attrs.onclick = function(e) {
					var result
					if (typeof onclick === "function") {
						result = onclick.call(e.currentTarget, e)
					} else if (onclick == null || typeof onclick !== "object") {
						// do nothing
					} else if (typeof onclick.handleEvent === "function") {
						onclick.handleEvent(e)
					}

					// Adapted from React Router's implementation:
					// https://github.com/ReactTraining/react-router/blob/520a0acd48ae1b066eb0b07d6d4d1790a1d02482/packages/react-router-dom/modules/Link.js
					//
					// Try to be flexible and intuitive in how we handle links.
					// Fun fact: links aren't as obvious to get right as you
					// would expect. There's a lot more valid ways to click a
					// link than this, and one might want to not simply click a
					// link, but right click or command-click it to copy the
					// link target, etc. Nope, this isn't just for blind people.
					if (
						// Skip if `onclick` prevented default
						result !== false && !e.defaultPrevented &&
						// Ignore everything but left clicks
						(e.button === 0 || e.which === 0 || e.which === 1) &&
						// Let the browser handle `target=_blank`, etc.
						(!e.currentTarget.target || e.currentTarget.target === "_self") &&
						// No modifier keys
						!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
					) {
						e.preventDefault()
						e.redraw = false
						route.set(href, null, options)
					}
				}
			}
			return child
		},
	}
	route.param = function(key) {
		return attrs && key != null ? attrs[key] : attrs
	}

	return route
}

},{"../render/vnode":"../node_modules/mithril/render/vnode.js","../render/hyperscript":"../node_modules/mithril/render/hyperscript.js","../promise/promise":"../node_modules/mithril/promise/promise.js","../pathname/build":"../node_modules/mithril/pathname/build.js","../pathname/parse":"../node_modules/mithril/pathname/parse.js","../pathname/compileTemplate":"../node_modules/mithril/pathname/compileTemplate.js","../pathname/assign":"../node_modules/mithril/pathname/assign.js"}],"../node_modules/mithril/route.js":[function(require,module,exports) {
"use strict"

var mountRedraw = require("./mount-redraw")

module.exports = require("./api/router")(window, mountRedraw)

},{"./mount-redraw":"../node_modules/mithril/mount-redraw.js","./api/router":"../node_modules/mithril/api/router.js"}],"../node_modules/mithril/index.js":[function(require,module,exports) {
"use strict"

var hyperscript = require("./hyperscript")
var request = require("./request")
var mountRedraw = require("./mount-redraw")

var m = function m() { return hyperscript.apply(this, arguments) }
m.m = hyperscript
m.trust = hyperscript.trust
m.fragment = hyperscript.fragment
m.mount = mountRedraw.mount
m.route = require("./route")
m.render = require("./render")
m.redraw = mountRedraw.redraw
m.request = request.request
m.jsonp = request.jsonp
m.parseQueryString = require("./querystring/parse")
m.buildQueryString = require("./querystring/build")
m.parsePathname = require("./pathname/parse")
m.buildPathname = require("./pathname/build")
m.vnode = require("./render/vnode")
m.PromisePolyfill = require("./promise/polyfill")

module.exports = m

},{"./hyperscript":"../node_modules/mithril/hyperscript.js","./request":"../node_modules/mithril/request.js","./mount-redraw":"../node_modules/mithril/mount-redraw.js","./route":"../node_modules/mithril/route.js","./render":"../node_modules/mithril/render.js","./querystring/parse":"../node_modules/mithril/querystring/parse.js","./querystring/build":"../node_modules/mithril/querystring/build.js","./pathname/parse":"../node_modules/mithril/pathname/parse.js","./pathname/build":"../node_modules/mithril/pathname/build.js","./render/vnode":"../node_modules/mithril/render/vnode.js","./promise/polyfill":"../node_modules/mithril/promise/polyfill.js"}],"../node_modules/parseuri/index.js":[function(require,module,exports) {
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    uri.pathNames = pathNames(uri, uri['path']);
    uri.queryKey = queryKey(uri, uri['query']);

    return uri;
};

function pathNames(obj, path) {
    var regx = /\/{2,9}/g,
        names = path.replace(regx, "/").split("/");

    if (path.substr(0, 1) == '/' || path.length === 0) {
        names.splice(0, 1);
    }
    if (path.substr(path.length - 1, 1) == '/') {
        names.splice(names.length - 1, 1);
    }

    return names;
}

function queryKey(uri, query) {
    var data = {};

    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
        if ($1) {
            data[$1] = $2;
        }
    });

    return data;
}

},{}],"../node_modules/socket.io-client/node_modules/ms/index.js":[function(require,module,exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],"../node_modules/socket.io-client/node_modules/debug/src/common.js":[function(require,module,exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":"../node_modules/socket.io-client/node_modules/ms/index.js"}],"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/socket.io-client/node_modules/debug/src/browser.js":[function(require,module,exports) {
var process = require("process");
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  const c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  let index = 0;
  let lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, match => {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log(...args) {
  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return typeof console === 'object' && console.log && console.log(...args);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  let r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = undefined;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
const {
  formatters
} = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
},{"./common":"../node_modules/socket.io-client/node_modules/debug/src/common.js","process":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../node_modules/socket.io-client/build/url.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.url = void 0;

var parseuri = require("parseuri");

var debug = require("debug")("socket.io-client:url");
/**
 * URL parser.
 *
 * @param uri - url
 * @param loc - An object meant to mimic window.location.
 *        Defaults to window.location.
 * @public
 */


function url(uri, loc) {
  var obj = uri; // default to window.location

  loc = loc || typeof location !== "undefined" && location;
  if (null == uri) uri = loc.protocol + "//" + loc.host; // relative path support

  if (typeof uri === "string") {
    if ("/" === uri.charAt(0)) {
      if ("/" === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug("protocol-less url %s", uri);

      if ("undefined" !== typeof loc) {
        uri = loc.protocol + "//" + uri;
      } else {
        uri = "https://" + uri;
      }
    } // parse


    debug("parse %s", uri);
    obj = parseuri(uri);
  } // make sure we treat `localhost:80` and `localhost` equally


  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = "80";
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = "443";
    }
  }

  obj.path = obj.path || "/";
  var ipv6 = obj.host.indexOf(":") !== -1;
  var host = ipv6 ? "[" + obj.host + "]" : obj.host; // define unique id

  obj.id = obj.protocol + "://" + host + ":" + obj.port; // define href

  obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
  return obj;
}

exports.url = url;
},{"parseuri":"../node_modules/parseuri/index.js","debug":"../node_modules/socket.io-client/node_modules/debug/src/browser.js"}],"../node_modules/has-cors/index.js":[function(require,module,exports) {

/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

},{}],"../node_modules/engine.io-client/lib/globalThis.browser.js":[function(require,module,exports) {
module.exports = (() => {
  if (typeof self !== "undefined") {
    return self;
  } else if (typeof window !== "undefined") {
    return window;
  } else {
    return Function("return this")();
  }
})();

},{}],"../node_modules/engine.io-client/lib/xmlhttprequest.js":[function(require,module,exports) {
// browser shim for xmlhttprequest module

const hasCORS = require("has-cors");
const globalThis = require("./globalThis");

module.exports = function(opts) {
  const xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  const xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  const enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) {}

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ("undefined" !== typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) {}

  if (!xdomain) {
    try {
      return new globalThis[["Active"].concat("Object").join("X")](
        "Microsoft.XMLHTTP"
      );
    } catch (e) {}
  }
};

},{"has-cors":"../node_modules/has-cors/index.js","./globalThis":"../node_modules/engine.io-client/lib/globalThis.browser.js"}],"../node_modules/engine.io-parser/lib/commons.js":[function(require,module,exports) {
var PACKET_TYPES = Object.create(null); // no Map = no polyfill

PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
var PACKET_TYPES_REVERSE = Object.create(null);
Object.keys(PACKET_TYPES).forEach(function (key) {
  PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
var ERROR_PACKET = {
  type: "error",
  data: "parser error"
};
module.exports = {
  PACKET_TYPES: PACKET_TYPES,
  PACKET_TYPES_REVERSE: PACKET_TYPES_REVERSE,
  ERROR_PACKET: ERROR_PACKET
};
},{}],"../node_modules/engine.io-parser/lib/encodePacket.browser.js":[function(require,module,exports) {
var _require = require("./commons"),
    PACKET_TYPES = _require.PACKET_TYPES;

var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
var withNativeArrayBuffer = typeof ArrayBuffer === "function"; // ArrayBuffer.isView method is not defined in IE10

var isView = function isView(obj) {
  return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
};

var encodePacket = function encodePacket(_ref, supportsBinary, callback) {
  var type = _ref.type,
      data = _ref.data;

  if (withNativeBlob && data instanceof Blob) {
    if (supportsBinary) {
      return callback(data);
    } else {
      return encodeBlobAsBase64(data, callback);
    }
  } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
    if (supportsBinary) {
      return callback(data instanceof ArrayBuffer ? data : data.buffer);
    } else {
      return encodeBlobAsBase64(new Blob([data]), callback);
    }
  } // plain string


  return callback(PACKET_TYPES[type] + (data || ""));
};

var encodeBlobAsBase64 = function encodeBlobAsBase64(data, callback) {
  var fileReader = new FileReader();

  fileReader.onload = function () {
    var content = fileReader.result.split(",")[1];
    callback("b" + content);
  };

  return fileReader.readAsDataURL(data);
};

module.exports = encodePacket;
},{"./commons":"../node_modules/engine.io-parser/lib/commons.js"}],"../node_modules/base64-arraybuffer/lib/base64-arraybuffer.js":[function(require,module,exports) {
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function (chars) {
  "use strict";

  exports.encode = function (arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
        i,
        len = bytes.length,
        base64 = "";

    for (i = 0; i < len; i += 3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
      base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
      base64 += chars[bytes[i + 2] & 63];
    }

    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode = function (base64) {
    var bufferLength = base64.length * 0.75,
        len = base64.length,
        i,
        p = 0,
        encoded1,
        encoded2,
        encoded3,
        encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;

      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i + 1]);
      encoded3 = chars.indexOf(base64[i + 2]);
      encoded4 = chars.indexOf(base64[i + 3]);
      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
},{}],"../node_modules/engine.io-parser/lib/decodePacket.browser.js":[function(require,module,exports) {
var _require = require("./commons"),
    PACKET_TYPES_REVERSE = _require.PACKET_TYPES_REVERSE,
    ERROR_PACKET = _require.ERROR_PACKET;

var withNativeArrayBuffer = typeof ArrayBuffer === "function";
var base64decoder;

if (withNativeArrayBuffer) {
  base64decoder = require("base64-arraybuffer");
}

var decodePacket = function decodePacket(encodedPacket, binaryType) {
  if (typeof encodedPacket !== "string") {
    return {
      type: "message",
      data: mapBinary(encodedPacket, binaryType)
    };
  }

  var type = encodedPacket.charAt(0);

  if (type === "b") {
    return {
      type: "message",
      data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
    };
  }

  var packetType = PACKET_TYPES_REVERSE[type];

  if (!packetType) {
    return ERROR_PACKET;
  }

  return encodedPacket.length > 1 ? {
    type: PACKET_TYPES_REVERSE[type],
    data: encodedPacket.substring(1)
  } : {
    type: PACKET_TYPES_REVERSE[type]
  };
};

var decodeBase64Packet = function decodeBase64Packet(data, binaryType) {
  if (base64decoder) {
    var decoded = base64decoder.decode(data);
    return mapBinary(decoded, binaryType);
  } else {
    return {
      base64: true,
      data: data
    }; // fallback for old browsers
  }
};

var mapBinary = function mapBinary(data, binaryType) {
  switch (binaryType) {
    case "blob":
      return data instanceof ArrayBuffer ? new Blob([data]) : data;

    case "arraybuffer":
    default:
      return data;
    // assuming the data is already an ArrayBuffer
  }
};

module.exports = decodePacket;
},{"./commons":"../node_modules/engine.io-parser/lib/commons.js","base64-arraybuffer":"../node_modules/base64-arraybuffer/lib/base64-arraybuffer.js"}],"../node_modules/engine.io-parser/lib/index.js":[function(require,module,exports) {
var encodePacket = require("./encodePacket");

var decodePacket = require("./decodePacket");

var SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text

var encodePayload = function encodePayload(packets, callback) {
  // some packets may be added to the array while encoding, so the initial length must be saved
  var length = packets.length;
  var encodedPackets = new Array(length);
  var count = 0;
  packets.forEach(function (packet, i) {
    // force base64 encoding for binary packets
    encodePacket(packet, false, function (encodedPacket) {
      encodedPackets[i] = encodedPacket;

      if (++count === length) {
        callback(encodedPackets.join(SEPARATOR));
      }
    });
  });
};

var decodePayload = function decodePayload(encodedPayload, binaryType) {
  var encodedPackets = encodedPayload.split(SEPARATOR);
  var packets = [];

  for (var i = 0; i < encodedPackets.length; i++) {
    var decodedPacket = decodePacket(encodedPackets[i], binaryType);
    packets.push(decodedPacket);

    if (decodedPacket.type === "error") {
      break;
    }
  }

  return packets;
};

module.exports = {
  protocol: 4,
  encodePacket: encodePacket,
  encodePayload: encodePayload,
  decodePacket: decodePacket,
  decodePayload: decodePayload
};
},{"./encodePacket":"../node_modules/engine.io-parser/lib/encodePacket.browser.js","./decodePacket":"../node_modules/engine.io-parser/lib/decodePacket.browser.js"}],"../node_modules/component-emitter/index.js":[function(require,module,exports) {

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],"../node_modules/engine.io-client/lib/transport.js":[function(require,module,exports) {
const parser = require("engine.io-parser");
const Emitter = require("component-emitter");

class Transport extends Emitter {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} options.
   * @api private
   */
  constructor(opts) {
    super();

    this.opts = opts;
    this.query = opts.query;
    this.readyState = "";
    this.socket = opts.socket;
  }

  /**
   * Emits an error.
   *
   * @param {String} str
   * @return {Transport} for chaining
   * @api public
   */
  onError(msg, desc) {
    const err = new Error(msg);
    err.type = "TransportError";
    err.description = desc;
    this.emit("error", err);
    return this;
  }

  /**
   * Opens the transport.
   *
   * @api public
   */
  open() {
    if ("closed" === this.readyState || "" === this.readyState) {
      this.readyState = "opening";
      this.doOpen();
    }

    return this;
  }

  /**
   * Closes the transport.
   *
   * @api private
   */
  close() {
    if ("opening" === this.readyState || "open" === this.readyState) {
      this.doClose();
      this.onClose();
    }

    return this;
  }

  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   * @api private
   */
  send(packets) {
    if ("open" === this.readyState) {
      this.write(packets);
    } else {
      throw new Error("Transport not open");
    }
  }

  /**
   * Called upon open
   *
   * @api private
   */
  onOpen() {
    this.readyState = "open";
    this.writable = true;
    this.emit("open");
  }

  /**
   * Called with data.
   *
   * @param {String} data
   * @api private
   */
  onData(data) {
    const packet = parser.decodePacket(data, this.socket.binaryType);
    this.onPacket(packet);
  }

  /**
   * Called with a decoded packet.
   */
  onPacket(packet) {
    this.emit("packet", packet);
  }

  /**
   * Called upon close.
   *
   * @api private
   */
  onClose() {
    this.readyState = "closed";
    this.emit("close");
  }
}

module.exports = Transport;

},{"engine.io-parser":"../node_modules/engine.io-parser/lib/index.js","component-emitter":"../node_modules/component-emitter/index.js"}],"../node_modules/parseqs/index.js":[function(require,module,exports) {
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

},{}],"../node_modules/yeast/index.js":[function(require,module,exports) {
'use strict';

var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;

},{}],"../node_modules/engine.io-client/node_modules/ms/index.js":[function(require,module,exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],"../node_modules/engine.io-client/node_modules/debug/src/common.js":[function(require,module,exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":"../node_modules/engine.io-client/node_modules/ms/index.js"}],"../node_modules/engine.io-client/node_modules/debug/src/browser.js":[function(require,module,exports) {
var process = require("process");
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  const c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  let index = 0;
  let lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, match => {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log(...args) {
  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return typeof console === 'object' && console.log && console.log(...args);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  let r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = undefined;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
const {
  formatters
} = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
},{"./common":"../node_modules/engine.io-client/node_modules/debug/src/common.js","process":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../node_modules/engine.io-client/lib/transports/polling.js":[function(require,module,exports) {
const Transport = require("../transport");
const parseqs = require("parseqs");
const parser = require("engine.io-parser");
const yeast = require("yeast");

const debug = require("debug")("engine.io-client:polling");

class Polling extends Transport {
  /**
   * Transport name.
   */
  get name() {
    return "polling";
  }

  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @api private
   */
  doOpen() {
    this.poll();
  }

  /**
   * Pauses polling.
   *
   * @param {Function} callback upon buffers are flushed and transport is paused
   * @api private
   */
  pause(onPause) {
    const self = this;

    this.readyState = "pausing";

    function pause() {
      debug("paused");
      self.readyState = "paused";
      onPause();
    }

    if (this.polling || !this.writable) {
      let total = 0;

      if (this.polling) {
        debug("we are currently polling - waiting to pause");
        total++;
        this.once("pollComplete", function() {
          debug("pre-pause polling complete");
          --total || pause();
        });
      }

      if (!this.writable) {
        debug("we are currently writing - waiting to pause");
        total++;
        this.once("drain", function() {
          debug("pre-pause writing complete");
          --total || pause();
        });
      }
    } else {
      pause();
    }
  }

  /**
   * Starts polling cycle.
   *
   * @api public
   */
  poll() {
    debug("polling");
    this.polling = true;
    this.doPoll();
    this.emit("poll");
  }

  /**
   * Overloads onData to detect payloads.
   *
   * @api private
   */
  onData(data) {
    const self = this;
    debug("polling got data %s", data);
    const callback = function(packet, index, total) {
      // if its the first message we consider the transport open
      if ("opening" === self.readyState && packet.type === "open") {
        self.onOpen();
      }

      // if its a close packet, we close the ongoing requests
      if ("close" === packet.type) {
        self.onClose();
        return false;
      }

      // otherwise bypass onData and handle the message
      self.onPacket(packet);
    };

    // decode payload
    parser.decodePayload(data, this.socket.binaryType).forEach(callback);

    // if an event did not trigger closing
    if ("closed" !== this.readyState) {
      // if we got data we're not polling
      this.polling = false;
      this.emit("pollComplete");

      if ("open" === this.readyState) {
        this.poll();
      } else {
        debug('ignoring poll - transport state "%s"', this.readyState);
      }
    }
  }

  /**
   * For polling, send a close packet.
   *
   * @api private
   */
  doClose() {
    const self = this;

    function close() {
      debug("writing close packet");
      self.write([{ type: "close" }]);
    }

    if ("open" === this.readyState) {
      debug("transport open - closing");
      close();
    } else {
      // in case we're trying to close while
      // handshaking is in progress (GH-164)
      debug("transport not open - deferring close");
      this.once("open", close);
    }
  }

  /**
   * Writes a packets payload.
   *
   * @param {Array} data packets
   * @param {Function} drain callback
   * @api private
   */
  write(packets) {
    this.writable = false;

    parser.encodePayload(packets, data => {
      this.doWrite(data, () => {
        this.writable = true;
        this.emit("drain");
      });
    });
  }

  /**
   * Generates uri for connection.
   *
   * @api private
   */
  uri() {
    let query = this.query || {};
    const schema = this.opts.secure ? "https" : "http";
    let port = "";

    // cache busting is forced
    if (false !== this.opts.timestampRequests) {
      query[this.opts.timestampParam] = yeast();
    }

    if (!this.supportsBinary && !query.sid) {
      query.b64 = 1;
    }

    query = parseqs.encode(query);

    // avoid port if default for schema
    if (
      this.opts.port &&
      (("https" === schema && Number(this.opts.port) !== 443) ||
        ("http" === schema && Number(this.opts.port) !== 80))
    ) {
      port = ":" + this.opts.port;
    }

    // prepend ? to query
    if (query.length) {
      query = "?" + query;
    }

    const ipv6 = this.opts.hostname.indexOf(":") !== -1;
    return (
      schema +
      "://" +
      (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
      port +
      this.opts.path +
      query
    );
  }
}

module.exports = Polling;

},{"../transport":"../node_modules/engine.io-client/lib/transport.js","parseqs":"../node_modules/parseqs/index.js","engine.io-parser":"../node_modules/engine.io-parser/lib/index.js","yeast":"../node_modules/yeast/index.js","debug":"../node_modules/engine.io-client/node_modules/debug/src/browser.js"}],"../node_modules/engine.io-client/lib/util.js":[function(require,module,exports) {
module.exports.pick = (obj, ...attr) => {
  return attr.reduce((acc, k) => {
    acc[k] = obj[k];
    return acc;
  }, {});
};

},{}],"../node_modules/engine.io-client/lib/transports/polling-xhr.js":[function(require,module,exports) {
/* global attachEvent */

const XMLHttpRequest = require("xmlhttprequest-ssl");
const Polling = require("./polling");
const Emitter = require("component-emitter");
const { pick } = require("../util");
const globalThis = require("../globalThis");

const debug = require("debug")("engine.io-client:polling-xhr");

/**
 * Empty function
 */

function empty() {}

const hasXHR2 = (function() {
  const xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

class XHR extends Polling {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @api public
   */
  constructor(opts) {
    super(opts);

    if (typeof location !== "undefined") {
      const isSSL = "https:" === location.protocol;
      let port = location.port;

      // some user agents have empty `location.port`
      if (!port) {
        port = isSSL ? 443 : 80;
      }

      this.xd =
        (typeof location !== "undefined" &&
          opts.hostname !== location.hostname) ||
        port !== opts.port;
      this.xs = opts.secure !== isSSL;
    }
    /**
     * XHR supports binary
     */
    const forceBase64 = opts && opts.forceBase64;
    this.supportsBinary = hasXHR2 && !forceBase64;
  }

  /**
   * Creates a request.
   *
   * @param {String} method
   * @api private
   */
  request(opts = {}) {
    Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
    return new Request(this.uri(), opts);
  }

  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @api private
   */
  doWrite(data, fn) {
    const req = this.request({
      method: "POST",
      data: data
    });
    const self = this;
    req.on("success", fn);
    req.on("error", function(err) {
      self.onError("xhr post error", err);
    });
  }

  /**
   * Starts a poll cycle.
   *
   * @api private
   */
  doPoll() {
    debug("xhr poll");
    const req = this.request();
    const self = this;
    req.on("data", function(data) {
      self.onData(data);
    });
    req.on("error", function(err) {
      self.onError("xhr poll error", err);
    });
    this.pollXhr = req;
  }
}

class Request extends Emitter {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @api public
   */
  constructor(uri, opts) {
    super();
    this.opts = opts;

    this.method = opts.method || "GET";
    this.uri = uri;
    this.async = false !== opts.async;
    this.data = undefined !== opts.data ? opts.data : null;

    this.create();
  }

  /**
   * Creates the XHR object and sends the request.
   *
   * @api private
   */
  create() {
    const opts = pick(
      this.opts,
      "agent",
      "enablesXDR",
      "pfx",
      "key",
      "passphrase",
      "cert",
      "ca",
      "ciphers",
      "rejectUnauthorized"
    );
    opts.xdomain = !!this.opts.xd;
    opts.xscheme = !!this.opts.xs;

    const xhr = (this.xhr = new XMLHttpRequest(opts));
    const self = this;

    try {
      debug("xhr open %s: %s", this.method, this.uri);
      xhr.open(this.method, this.uri, this.async);
      try {
        if (this.opts.extraHeaders) {
          xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
          for (let i in this.opts.extraHeaders) {
            if (this.opts.extraHeaders.hasOwnProperty(i)) {
              xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
            }
          }
        }
      } catch (e) {}

      if ("POST" === this.method) {
        try {
          xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch (e) {}
      }

      try {
        xhr.setRequestHeader("Accept", "*/*");
      } catch (e) {}

      // ie6 check
      if ("withCredentials" in xhr) {
        xhr.withCredentials = this.opts.withCredentials;
      }

      if (this.opts.requestTimeout) {
        xhr.timeout = this.opts.requestTimeout;
      }

      if (this.hasXDR()) {
        xhr.onload = function() {
          self.onLoad();
        };
        xhr.onerror = function() {
          self.onError(xhr.responseText);
        };
      } else {
        xhr.onreadystatechange = function() {
          if (4 !== xhr.readyState) return;
          if (200 === xhr.status || 1223 === xhr.status) {
            self.onLoad();
          } else {
            // make sure the `error` event handler that's user-set
            // does not throw in the same tick and gets caught here
            setTimeout(function() {
              self.onError(typeof xhr.status === "number" ? xhr.status : 0);
            }, 0);
          }
        };
      }

      debug("xhr data %s", this.data);
      xhr.send(this.data);
    } catch (e) {
      // Need to defer since .create() is called directly from the constructor
      // and thus the 'error' event can only be only bound *after* this exception
      // occurs.  Therefore, also, we cannot throw here at all.
      setTimeout(function() {
        self.onError(e);
      }, 0);
      return;
    }

    if (typeof document !== "undefined") {
      this.index = Request.requestsCount++;
      Request.requests[this.index] = this;
    }
  }

  /**
   * Called upon successful response.
   *
   * @api private
   */
  onSuccess() {
    this.emit("success");
    this.cleanup();
  }

  /**
   * Called if we have data.
   *
   * @api private
   */
  onData(data) {
    this.emit("data", data);
    this.onSuccess();
  }

  /**
   * Called upon error.
   *
   * @api private
   */
  onError(err) {
    this.emit("error", err);
    this.cleanup(true);
  }

  /**
   * Cleans up house.
   *
   * @api private
   */
  cleanup(fromError) {
    if ("undefined" === typeof this.xhr || null === this.xhr) {
      return;
    }
    // xmlhttprequest
    if (this.hasXDR()) {
      this.xhr.onload = this.xhr.onerror = empty;
    } else {
      this.xhr.onreadystatechange = empty;
    }

    if (fromError) {
      try {
        this.xhr.abort();
      } catch (e) {}
    }

    if (typeof document !== "undefined") {
      delete Request.requests[this.index];
    }

    this.xhr = null;
  }

  /**
   * Called upon load.
   *
   * @api private
   */
  onLoad() {
    const data = this.xhr.responseText;
    if (data !== null) {
      this.onData(data);
    }
  }

  /**
   * Check if it has XDomainRequest.
   *
   * @api private
   */
  hasXDR() {
    return typeof XDomainRequest !== "undefined" && !this.xs && this.enablesXDR;
  }

  /**
   * Aborts the request.
   *
   * @api public
   */
  abort() {
    this.cleanup();
  }
}

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (typeof document !== "undefined") {
  if (typeof attachEvent === "function") {
    attachEvent("onunload", unloadHandler);
  } else if (typeof addEventListener === "function") {
    const terminationEvent = "onpagehide" in globalThis ? "pagehide" : "unload";
    addEventListener(terminationEvent, unloadHandler, false);
  }
}

function unloadHandler() {
  for (let i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

module.exports = XHR;
module.exports.Request = Request;

},{"xmlhttprequest-ssl":"../node_modules/engine.io-client/lib/xmlhttprequest.js","./polling":"../node_modules/engine.io-client/lib/transports/polling.js","component-emitter":"../node_modules/component-emitter/index.js","../util":"../node_modules/engine.io-client/lib/util.js","../globalThis":"../node_modules/engine.io-client/lib/globalThis.browser.js","debug":"../node_modules/engine.io-client/node_modules/debug/src/browser.js"}],"../node_modules/engine.io-client/lib/transports/polling-jsonp.js":[function(require,module,exports) {
const Polling = require("./polling");
const globalThis = require("../globalThis");

const rNewline = /\n/g;
const rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

let callbacks;

/**
 * Noop.
 */

function empty() {}

class JSONPPolling extends Polling {
  /**
   * JSONP Polling constructor.
   *
   * @param {Object} opts.
   * @api public
   */
  constructor(opts) {
    super(opts);

    this.query = this.query || {};

    // define global callbacks array if not present
    // we do this here (lazily) to avoid unneeded global pollution
    if (!callbacks) {
      // we need to consider multiple engines in the same page
      callbacks = globalThis.___eio = globalThis.___eio || [];
    }

    // callback identifier
    this.index = callbacks.length;

    // add callback to jsonp global
    const self = this;
    callbacks.push(function(msg) {
      self.onData(msg);
    });

    // append to query string
    this.query.j = this.index;

    // prevent spurious errors from being emitted when the window is unloaded
    if (typeof addEventListener === "function") {
      addEventListener(
        "beforeunload",
        function() {
          if (self.script) self.script.onerror = empty;
        },
        false
      );
    }
  }

  /**
   * JSONP only supports binary as base64 encoded strings
   */
  get supportsBinary() {
    return false;
  }

  /**
   * Closes the socket.
   *
   * @api private
   */
  doClose() {
    if (this.script) {
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }

    if (this.form) {
      this.form.parentNode.removeChild(this.form);
      this.form = null;
      this.iframe = null;
    }

    super.doClose();
  }

  /**
   * Starts a poll cycle.
   *
   * @api private
   */
  doPoll() {
    const self = this;
    const script = document.createElement("script");

    if (this.script) {
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }

    script.async = true;
    script.src = this.uri();
    script.onerror = function(e) {
      self.onError("jsonp poll error", e);
    };

    const insertAt = document.getElementsByTagName("script")[0];
    if (insertAt) {
      insertAt.parentNode.insertBefore(script, insertAt);
    } else {
      (document.head || document.body).appendChild(script);
    }
    this.script = script;

    const isUAgecko =
      "undefined" !== typeof navigator && /gecko/i.test(navigator.userAgent);

    if (isUAgecko) {
      setTimeout(function() {
        const iframe = document.createElement("iframe");
        document.body.appendChild(iframe);
        document.body.removeChild(iframe);
      }, 100);
    }
  }

  /**
   * Writes with a hidden iframe.
   *
   * @param {String} data to send
   * @param {Function} called upon flush.
   * @api private
   */
  doWrite(data, fn) {
    const self = this;
    let iframe;

    if (!this.form) {
      const form = document.createElement("form");
      const area = document.createElement("textarea");
      const id = (this.iframeId = "eio_iframe_" + this.index);

      form.className = "socketio";
      form.style.position = "absolute";
      form.style.top = "-1000px";
      form.style.left = "-1000px";
      form.target = id;
      form.method = "POST";
      form.setAttribute("accept-charset", "utf-8");
      area.name = "d";
      form.appendChild(area);
      document.body.appendChild(form);

      this.form = form;
      this.area = area;
    }

    this.form.action = this.uri();

    function complete() {
      initIframe();
      fn();
    }

    function initIframe() {
      if (self.iframe) {
        try {
          self.form.removeChild(self.iframe);
        } catch (e) {
          self.onError("jsonp polling iframe removal error", e);
        }
      }

      try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        const html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
        iframe = document.createElement(html);
      } catch (e) {
        iframe = document.createElement("iframe");
        iframe.name = self.iframeId;
        iframe.src = "javascript:0";
      }

      iframe.id = self.iframeId;

      self.form.appendChild(iframe);
      self.iframe = iframe;
    }

    initIframe();

    // escape \n to prevent it from being converted into \r\n by some UAs
    // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
    data = data.replace(rEscapedNewline, "\\\n");
    this.area.value = data.replace(rNewline, "\\n");

    try {
      this.form.submit();
    } catch (e) {}

    if (this.iframe.attachEvent) {
      this.iframe.onreadystatechange = function() {
        if (self.iframe.readyState === "complete") {
          complete();
        }
      };
    } else {
      this.iframe.onload = complete;
    }
  }
}

module.exports = JSONPPolling;

},{"./polling":"../node_modules/engine.io-client/lib/transports/polling.js","../globalThis":"../node_modules/engine.io-client/lib/globalThis.browser.js"}],"../node_modules/engine.io-client/lib/transports/websocket-constructor.browser.js":[function(require,module,exports) {
const globalThis = require("../globalThis");

module.exports = {
  WebSocket: globalThis.WebSocket || globalThis.MozWebSocket,
  usingBrowserWebSocket: true,
  defaultBinaryType: "arraybuffer"
};

},{"../globalThis":"../node_modules/engine.io-client/lib/globalThis.browser.js"}],"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/base64-js/index.js","ieee754":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/ieee754/index.js","isarray":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/isarray/index.js","buffer":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"../node_modules/engine.io-client/lib/transports/websocket.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
const Transport = require("../transport");
const parser = require("engine.io-parser");
const parseqs = require("parseqs");
const yeast = require("yeast");
const { pick } = require("../util");
const {
  WebSocket,
  usingBrowserWebSocket,
  defaultBinaryType
} = require("./websocket-constructor");

const debug = require("debug")("engine.io-client:websocket");

// detect ReactNative environment
const isReactNative =
  typeof navigator !== "undefined" &&
  typeof navigator.product === "string" &&
  navigator.product.toLowerCase() === "reactnative";

class WS extends Transport {
  /**
   * WebSocket transport constructor.
   *
   * @api {Object} connection options
   * @api public
   */
  constructor(opts) {
    super(opts);

    this.supportsBinary = !opts.forceBase64;
  }

  /**
   * Transport name.
   *
   * @api public
   */
  get name() {
    return "websocket";
  }

  /**
   * Opens socket.
   *
   * @api private
   */
  doOpen() {
    if (!this.check()) {
      // let probe timeout
      return;
    }

    const uri = this.uri();
    const protocols = this.opts.protocols;

    // React Native only supports the 'headers' option, and will print a warning if anything else is passed
    const opts = isReactNative
      ? {}
      : pick(
          this.opts,
          "agent",
          "perMessageDeflate",
          "pfx",
          "key",
          "passphrase",
          "cert",
          "ca",
          "ciphers",
          "rejectUnauthorized",
          "localAddress"
        );

    if (this.opts.extraHeaders) {
      opts.headers = this.opts.extraHeaders;
    }

    try {
      this.ws =
        usingBrowserWebSocket && !isReactNative
          ? protocols
            ? new WebSocket(uri, protocols)
            : new WebSocket(uri)
          : new WebSocket(uri, protocols, opts);
    } catch (err) {
      return this.emit("error", err);
    }

    this.ws.binaryType = this.socket.binaryType || defaultBinaryType;

    this.addEventListeners();
  }

  /**
   * Adds event listeners to the socket
   *
   * @api private
   */
  addEventListeners() {
    const self = this;

    this.ws.onopen = function() {
      self.onOpen();
    };
    this.ws.onclose = function() {
      self.onClose();
    };
    this.ws.onmessage = function(ev) {
      self.onData(ev.data);
    };
    this.ws.onerror = function(e) {
      self.onError("websocket error", e);
    };
  }

  /**
   * Writes data to socket.
   *
   * @param {Array} array of packets.
   * @api private
   */
  write(packets) {
    const self = this;
    this.writable = false;

    // encodePacket efficient as it uses WS framing
    // no need for encodePayload
    let total = packets.length;
    let i = 0;
    const l = total;
    for (; i < l; i++) {
      (function(packet) {
        parser.encodePacket(packet, self.supportsBinary, function(data) {
          // always create a new object (GH-437)
          const opts = {};
          if (!usingBrowserWebSocket) {
            if (packet.options) {
              opts.compress = packet.options.compress;
            }

            if (self.opts.perMessageDeflate) {
              const len =
                "string" === typeof data
                  ? Buffer.byteLength(data)
                  : data.length;
              if (len < self.opts.perMessageDeflate.threshold) {
                opts.compress = false;
              }
            }
          }

          // Sometimes the websocket has already been closed but the browser didn't
          // have a chance of informing us about it yet, in that case send will
          // throw an error
          try {
            if (usingBrowserWebSocket) {
              // TypeError is thrown when passing the second argument on Safari
              self.ws.send(data);
            } else {
              self.ws.send(data, opts);
            }
          } catch (e) {
            debug("websocket closed before onclose event");
          }

          --total || done();
        });
      })(packets[i]);
    }

    function done() {
      self.emit("flush");

      // fake drain
      // defer to next tick to allow Socket to clear writeBuffer
      setTimeout(function() {
        self.writable = true;
        self.emit("drain");
      }, 0);
    }
  }

  /**
   * Called upon close
   *
   * @api private
   */
  onClose() {
    Transport.prototype.onClose.call(this);
  }

  /**
   * Closes socket.
   *
   * @api private
   */
  doClose() {
    if (typeof this.ws !== "undefined") {
      this.ws.close();
    }
  }

  /**
   * Generates uri for connection.
   *
   * @api private
   */
  uri() {
    let query = this.query || {};
    const schema = this.opts.secure ? "wss" : "ws";
    let port = "";

    // avoid port if default for schema
    if (
      this.opts.port &&
      (("wss" === schema && Number(this.opts.port) !== 443) ||
        ("ws" === schema && Number(this.opts.port) !== 80))
    ) {
      port = ":" + this.opts.port;
    }

    // append timestamp to URI
    if (this.opts.timestampRequests) {
      query[this.opts.timestampParam] = yeast();
    }

    // communicate binary support capabilities
    if (!this.supportsBinary) {
      query.b64 = 1;
    }

    query = parseqs.encode(query);

    // prepend ? to query
    if (query.length) {
      query = "?" + query;
    }

    const ipv6 = this.opts.hostname.indexOf(":") !== -1;
    return (
      schema +
      "://" +
      (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
      port +
      this.opts.path +
      query
    );
  }

  /**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @api public
   */
  check() {
    return (
      !!WebSocket &&
      !("__initialize" in WebSocket && this.name === WS.prototype.name)
    );
  }
}

module.exports = WS;

},{"../transport":"../node_modules/engine.io-client/lib/transport.js","engine.io-parser":"../node_modules/engine.io-parser/lib/index.js","parseqs":"../node_modules/parseqs/index.js","yeast":"../node_modules/yeast/index.js","../util":"../node_modules/engine.io-client/lib/util.js","./websocket-constructor":"../node_modules/engine.io-client/lib/transports/websocket-constructor.browser.js","debug":"../node_modules/engine.io-client/node_modules/debug/src/browser.js","buffer":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"../node_modules/engine.io-client/lib/transports/index.js":[function(require,module,exports) {
const XMLHttpRequest = require("xmlhttprequest-ssl");
const XHR = require("./polling-xhr");
const JSONP = require("./polling-jsonp");
const websocket = require("./websocket");

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling(opts) {
  let xhr;
  let xd = false;
  let xs = false;
  const jsonp = false !== opts.jsonp;

  if (typeof location !== "undefined") {
    const isSSL = "https:" === location.protocol;
    let port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ("open" in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error("JSONP disabled");
    return new JSONP(opts);
  }
}

},{"xmlhttprequest-ssl":"../node_modules/engine.io-client/lib/xmlhttprequest.js","./polling-xhr":"../node_modules/engine.io-client/lib/transports/polling-xhr.js","./polling-jsonp":"../node_modules/engine.io-client/lib/transports/polling-jsonp.js","./websocket":"../node_modules/engine.io-client/lib/transports/websocket.js"}],"../node_modules/engine.io-client/lib/socket.js":[function(require,module,exports) {
const transports = require("./transports/index");
const Emitter = require("component-emitter");
const debug = require("debug")("engine.io-client:socket");
const parser = require("engine.io-parser");
const parseuri = require("parseuri");
const parseqs = require("parseqs");

class Socket extends Emitter {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri or options
   * @param {Object} options
   * @api public
   */
  constructor(uri, opts = {}) {
    super();

    if (uri && "object" === typeof uri) {
      opts = uri;
      uri = null;
    }

    if (uri) {
      uri = parseuri(uri);
      opts.hostname = uri.host;
      opts.secure = uri.protocol === "https" || uri.protocol === "wss";
      opts.port = uri.port;
      if (uri.query) opts.query = uri.query;
    } else if (opts.host) {
      opts.hostname = parseuri(opts.host).host;
    }

    this.secure =
      null != opts.secure
        ? opts.secure
        : typeof location !== "undefined" && "https:" === location.protocol;

    if (opts.hostname && !opts.port) {
      // if no port is specified manually, use the protocol default
      opts.port = this.secure ? "443" : "80";
    }

    this.hostname =
      opts.hostname ||
      (typeof location !== "undefined" ? location.hostname : "localhost");
    this.port =
      opts.port ||
      (typeof location !== "undefined" && location.port
        ? location.port
        : this.secure
        ? 443
        : 80);

    this.transports = opts.transports || ["polling", "websocket"];
    this.readyState = "";
    this.writeBuffer = [];
    this.prevBufferLen = 0;

    this.opts = Object.assign(
      {
        path: "/engine.io",
        agent: false,
        withCredentials: false,
        upgrade: true,
        jsonp: true,
        timestampParam: "t",
        rememberUpgrade: false,
        rejectUnauthorized: true,
        perMessageDeflate: {
          threshold: 1024
        },
        transportOptions: {}
      },
      opts
    );

    this.opts.path = this.opts.path.replace(/\/$/, "") + "/";

    if (typeof this.opts.query === "string") {
      this.opts.query = parseqs.decode(this.opts.query);
    }

    // set on handshake
    this.id = null;
    this.upgrades = null;
    this.pingInterval = null;
    this.pingTimeout = null;

    // set on heartbeat
    this.pingTimeoutTimer = null;

    this.open();
  }

  /**
   * Creates transport of the given type.
   *
   * @param {String} transport name
   * @return {Transport}
   * @api private
   */
  createTransport(name) {
    debug('creating transport "%s"', name);
    const query = clone(this.opts.query);

    // append engine.io protocol identifier
    query.EIO = parser.protocol;

    // transport name
    query.transport = name;

    // session id if we already have one
    if (this.id) query.sid = this.id;

    const opts = Object.assign(
      {},
      this.opts.transportOptions[name],
      this.opts,
      {
        query,
        socket: this,
        hostname: this.hostname,
        secure: this.secure,
        port: this.port
      }
    );

    debug("options: %j", opts);

    return new transports[name](opts);
  }

  /**
   * Initializes transport to use and starts probe.
   *
   * @api private
   */
  open() {
    let transport;
    if (
      this.opts.rememberUpgrade &&
      Socket.priorWebsocketSuccess &&
      this.transports.indexOf("websocket") !== -1
    ) {
      transport = "websocket";
    } else if (0 === this.transports.length) {
      // Emit error on next tick so it can be listened to
      const self = this;
      setTimeout(function() {
        self.emit("error", "No transports available");
      }, 0);
      return;
    } else {
      transport = this.transports[0];
    }
    this.readyState = "opening";

    // Retry with the next transport if the transport is disabled (jsonp: false)
    try {
      transport = this.createTransport(transport);
    } catch (e) {
      debug("error while creating transport: %s", e);
      this.transports.shift();
      this.open();
      return;
    }

    transport.open();
    this.setTransport(transport);
  }

  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @api private
   */
  setTransport(transport) {
    debug("setting transport %s", transport.name);
    const self = this;

    if (this.transport) {
      debug("clearing existing transport %s", this.transport.name);
      this.transport.removeAllListeners();
    }

    // set up transport
    this.transport = transport;

    // set up transport listeners
    transport
      .on("drain", function() {
        self.onDrain();
      })
      .on("packet", function(packet) {
        self.onPacket(packet);
      })
      .on("error", function(e) {
        self.onError(e);
      })
      .on("close", function() {
        self.onClose("transport close");
      });
  }

  /**
   * Probes a transport.
   *
   * @param {String} transport name
   * @api private
   */
  probe(name) {
    debug('probing transport "%s"', name);
    let transport = this.createTransport(name, { probe: 1 });
    let failed = false;
    const self = this;

    Socket.priorWebsocketSuccess = false;

    function onTransportOpen() {
      if (self.onlyBinaryUpgrades) {
        const upgradeLosesBinary =
          !this.supportsBinary && self.transport.supportsBinary;
        failed = failed || upgradeLosesBinary;
      }
      if (failed) return;

      debug('probe transport "%s" opened', name);
      transport.send([{ type: "ping", data: "probe" }]);
      transport.once("packet", function(msg) {
        if (failed) return;
        if ("pong" === msg.type && "probe" === msg.data) {
          debug('probe transport "%s" pong', name);
          self.upgrading = true;
          self.emit("upgrading", transport);
          if (!transport) return;
          Socket.priorWebsocketSuccess = "websocket" === transport.name;

          debug('pausing current transport "%s"', self.transport.name);
          self.transport.pause(function() {
            if (failed) return;
            if ("closed" === self.readyState) return;
            debug("changing transport and sending upgrade packet");

            cleanup();

            self.setTransport(transport);
            transport.send([{ type: "upgrade" }]);
            self.emit("upgrade", transport);
            transport = null;
            self.upgrading = false;
            self.flush();
          });
        } else {
          debug('probe transport "%s" failed', name);
          const err = new Error("probe error");
          err.transport = transport.name;
          self.emit("upgradeError", err);
        }
      });
    }

    function freezeTransport() {
      if (failed) return;

      // Any callback called by transport should be ignored since now
      failed = true;

      cleanup();

      transport.close();
      transport = null;
    }

    // Handle any error that happens while probing
    function onerror(err) {
      const error = new Error("probe error: " + err);
      error.transport = transport.name;

      freezeTransport();

      debug('probe transport "%s" failed because of error: %s', name, err);

      self.emit("upgradeError", error);
    }

    function onTransportClose() {
      onerror("transport closed");
    }

    // When the socket is closed while we're probing
    function onclose() {
      onerror("socket closed");
    }

    // When the socket is upgraded while we're probing
    function onupgrade(to) {
      if (transport && to.name !== transport.name) {
        debug('"%s" works - aborting "%s"', to.name, transport.name);
        freezeTransport();
      }
    }

    // Remove all listeners on the transport and on self
    function cleanup() {
      transport.removeListener("open", onTransportOpen);
      transport.removeListener("error", onerror);
      transport.removeListener("close", onTransportClose);
      self.removeListener("close", onclose);
      self.removeListener("upgrading", onupgrade);
    }

    transport.once("open", onTransportOpen);
    transport.once("error", onerror);
    transport.once("close", onTransportClose);

    this.once("close", onclose);
    this.once("upgrading", onupgrade);

    transport.open();
  }

  /**
   * Called when connection is deemed open.
   *
   * @api public
   */
  onOpen() {
    debug("socket open");
    this.readyState = "open";
    Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
    this.emit("open");
    this.flush();

    // we check for `readyState` in case an `open`
    // listener already closed the socket
    if (
      "open" === this.readyState &&
      this.opts.upgrade &&
      this.transport.pause
    ) {
      debug("starting upgrade probes");
      let i = 0;
      const l = this.upgrades.length;
      for (; i < l; i++) {
        this.probe(this.upgrades[i]);
      }
    }
  }

  /**
   * Handles a packet.
   *
   * @api private
   */
  onPacket(packet) {
    if (
      "opening" === this.readyState ||
      "open" === this.readyState ||
      "closing" === this.readyState
    ) {
      debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

      this.emit("packet", packet);

      // Socket is live - any packet counts
      this.emit("heartbeat");

      switch (packet.type) {
        case "open":
          this.onHandshake(JSON.parse(packet.data));
          break;

        case "ping":
          this.resetPingTimeout();
          this.sendPacket("pong");
          this.emit("pong");
          break;

        case "error":
          const err = new Error("server error");
          err.code = packet.data;
          this.onError(err);
          break;

        case "message":
          this.emit("data", packet.data);
          this.emit("message", packet.data);
          break;
      }
    } else {
      debug('packet received with socket readyState "%s"', this.readyState);
    }
  }

  /**
   * Called upon handshake completion.
   *
   * @param {Object} handshake obj
   * @api private
   */
  onHandshake(data) {
    this.emit("handshake", data);
    this.id = data.sid;
    this.transport.query.sid = data.sid;
    this.upgrades = this.filterUpgrades(data.upgrades);
    this.pingInterval = data.pingInterval;
    this.pingTimeout = data.pingTimeout;
    this.onOpen();
    // In case open handler closes socket
    if ("closed" === this.readyState) return;
    this.resetPingTimeout();
  }

  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @api private
   */
  resetPingTimeout() {
    clearTimeout(this.pingTimeoutTimer);
    this.pingTimeoutTimer = setTimeout(() => {
      this.onClose("ping timeout");
    }, this.pingInterval + this.pingTimeout);
  }

  /**
   * Called on `drain` event
   *
   * @api private
   */
  onDrain() {
    this.writeBuffer.splice(0, this.prevBufferLen);

    // setting prevBufferLen = 0 is very important
    // for example, when upgrading, upgrade packet is sent over,
    // and a nonzero prevBufferLen could cause problems on `drain`
    this.prevBufferLen = 0;

    if (0 === this.writeBuffer.length) {
      this.emit("drain");
    } else {
      this.flush();
    }
  }

  /**
   * Flush write buffers.
   *
   * @api private
   */
  flush() {
    if (
      "closed" !== this.readyState &&
      this.transport.writable &&
      !this.upgrading &&
      this.writeBuffer.length
    ) {
      debug("flushing %d packets in socket", this.writeBuffer.length);
      this.transport.send(this.writeBuffer);
      // keep track of current length of writeBuffer
      // splice writeBuffer and callbackBuffer on `drain`
      this.prevBufferLen = this.writeBuffer.length;
      this.emit("flush");
    }
  }

  /**
   * Sends a message.
   *
   * @param {String} message.
   * @param {Function} callback function.
   * @param {Object} options.
   * @return {Socket} for chaining.
   * @api public
   */
  write(msg, options, fn) {
    this.sendPacket("message", msg, options, fn);
    return this;
  }

  send(msg, options, fn) {
    this.sendPacket("message", msg, options, fn);
    return this;
  }

  /**
   * Sends a packet.
   *
   * @param {String} packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} callback function.
   * @api private
   */
  sendPacket(type, data, options, fn) {
    if ("function" === typeof data) {
      fn = data;
      data = undefined;
    }

    if ("function" === typeof options) {
      fn = options;
      options = null;
    }

    if ("closing" === this.readyState || "closed" === this.readyState) {
      return;
    }

    options = options || {};
    options.compress = false !== options.compress;

    const packet = {
      type: type,
      data: data,
      options: options
    };
    this.emit("packetCreate", packet);
    this.writeBuffer.push(packet);
    if (fn) this.once("flush", fn);
    this.flush();
  }

  /**
   * Closes the connection.
   *
   * @api private
   */
  close() {
    const self = this;

    if ("opening" === this.readyState || "open" === this.readyState) {
      this.readyState = "closing";

      if (this.writeBuffer.length) {
        this.once("drain", function() {
          if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        });
      } else if (this.upgrading) {
        waitForUpgrade();
      } else {
        close();
      }
    }

    function close() {
      self.onClose("forced close");
      debug("socket closing - telling transport to close");
      self.transport.close();
    }

    function cleanupAndClose() {
      self.removeListener("upgrade", cleanupAndClose);
      self.removeListener("upgradeError", cleanupAndClose);
      close();
    }

    function waitForUpgrade() {
      // wait for upgrade to finish since we can't send packets while pausing a transport
      self.once("upgrade", cleanupAndClose);
      self.once("upgradeError", cleanupAndClose);
    }

    return this;
  }

  /**
   * Called upon transport error
   *
   * @api private
   */
  onError(err) {
    debug("socket error %j", err);
    Socket.priorWebsocketSuccess = false;
    this.emit("error", err);
    this.onClose("transport error", err);
  }

  /**
   * Called upon transport close.
   *
   * @api private
   */
  onClose(reason, desc) {
    if (
      "opening" === this.readyState ||
      "open" === this.readyState ||
      "closing" === this.readyState
    ) {
      debug('socket close with reason: "%s"', reason);
      const self = this;

      // clear timers
      clearTimeout(this.pingIntervalTimer);
      clearTimeout(this.pingTimeoutTimer);

      // stop event from firing again for transport
      this.transport.removeAllListeners("close");

      // ensure transport won't stay open
      this.transport.close();

      // ignore further transport communication
      this.transport.removeAllListeners();

      // set ready state
      this.readyState = "closed";

      // clear session id
      this.id = null;

      // emit close event
      this.emit("close", reason, desc);

      // clean buffers after, so users can still
      // grab the buffers on `close` event
      self.writeBuffer = [];
      self.prevBufferLen = 0;
    }
  }

  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} server upgrades
   * @api private
   *
   */
  filterUpgrades(upgrades) {
    const filteredUpgrades = [];
    let i = 0;
    const j = upgrades.length;
    for (; i < j; i++) {
      if (~this.transports.indexOf(upgrades[i]))
        filteredUpgrades.push(upgrades[i]);
    }
    return filteredUpgrades;
  }
}

Socket.priorWebsocketSuccess = false;

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

function clone(obj) {
  const o = {};
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

module.exports = Socket;

},{"./transports/index":"../node_modules/engine.io-client/lib/transports/index.js","component-emitter":"../node_modules/component-emitter/index.js","debug":"../node_modules/engine.io-client/node_modules/debug/src/browser.js","engine.io-parser":"../node_modules/engine.io-parser/lib/index.js","parseuri":"../node_modules/parseuri/index.js","parseqs":"../node_modules/parseqs/index.js"}],"../node_modules/engine.io-client/lib/index.js":[function(require,module,exports) {
const Socket = require("./socket");

module.exports = (uri, opts) => new Socket(uri, opts);

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

module.exports.Socket = Socket;
module.exports.protocol = Socket.protocol; // this is an int
module.exports.Transport = require("./transport");
module.exports.transports = require("./transports/index");
module.exports.parser = require("engine.io-parser");

},{"./socket":"../node_modules/engine.io-client/lib/socket.js","./transport":"../node_modules/engine.io-client/lib/transport.js","./transports/index":"../node_modules/engine.io-client/lib/transports/index.js","engine.io-parser":"../node_modules/engine.io-parser/lib/index.js"}],"../node_modules/socket.io-parser/dist/is-binary.js":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasBinary = exports.isBinary = void 0;
var withNativeArrayBuffer = typeof ArrayBuffer === "function";

var isView = function isView(obj) {
  return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
};

var toString = Object.prototype.toString;
var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
var withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
/**
 * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
 *
 * @private
 */

function isBinary(obj) {
  return withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)) || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File;
}

exports.isBinary = isBinary;

function hasBinary(obj, toJSON) {
  if (!obj || _typeof(obj) !== "object") {
    return false;
  }

  if (Array.isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }

    return false;
  }

  if (isBinary(obj)) {
    return true;
  }

  if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }

  return false;
}

exports.hasBinary = hasBinary;
},{}],"../node_modules/socket.io-parser/dist/binary.js":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reconstructPacket = exports.deconstructPacket = void 0;

var is_binary_1 = require("./is-binary");
/**
 * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @public
 */


function deconstructPacket(packet) {
  var buffers = [];
  var packetData = packet.data;
  var pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length; // number of binary 'attachments'

  return {
    packet: pack,
    buffers: buffers
  };
}

exports.deconstructPacket = deconstructPacket;

function _deconstructPacket(data, buffers) {
  if (!data) return data;

  if (is_binary_1.isBinary(data)) {
    var placeholder = {
      _placeholder: true,
      num: buffers.length
    };
    buffers.push(data);
    return placeholder;
  } else if (Array.isArray(data)) {
    var newData = new Array(data.length);

    for (var i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }

    return newData;
  } else if (_typeof(data) === "object" && !(data instanceof Date)) {
    var _newData = {};

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        _newData[key] = _deconstructPacket(data[key], buffers);
      }
    }

    return _newData;
  }

  return data;
}
/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @public
 */


function reconstructPacket(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  packet.attachments = undefined; // no longer useful

  return packet;
}

exports.reconstructPacket = reconstructPacket;

function _reconstructPacket(data, buffers) {
  if (!data) return data;

  if (data && data._placeholder) {
    return buffers[data.num]; // appropriate buffer (should be natural order anyway)
  } else if (Array.isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (_typeof(data) === "object") {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        data[key] = _reconstructPacket(data[key], buffers);
      }
    }
  }

  return data;
}
},{"./is-binary":"../node_modules/socket.io-parser/dist/is-binary.js"}],"../node_modules/socket.io-parser/node_modules/ms/index.js":[function(require,module,exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],"../node_modules/socket.io-parser/node_modules/debug/src/common.js":[function(require,module,exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":"../node_modules/socket.io-parser/node_modules/ms/index.js"}],"../node_modules/socket.io-parser/node_modules/debug/src/browser.js":[function(require,module,exports) {
var process = require("process");
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  const c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  let index = 0;
  let lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, match => {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log(...args) {
  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return typeof console === 'object' && console.log && console.log(...args);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  let r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = undefined;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
const {
  formatters
} = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
},{"./common":"../node_modules/socket.io-parser/node_modules/debug/src/common.js","process":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../node_modules/socket.io-parser/dist/index.js":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Decoder = exports.Encoder = exports.PacketType = exports.protocol = void 0;

var Emitter = require("component-emitter");

var binary_1 = require("./binary");

var is_binary_1 = require("./is-binary");

var debug = require("debug")("socket.io-parser");
/**
 * Protocol version.
 *
 * @public
 */


exports.protocol = 5;
var PacketType;

(function (PacketType) {
  PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
  PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
  PacketType[PacketType["EVENT"] = 2] = "EVENT";
  PacketType[PacketType["ACK"] = 3] = "ACK";
  PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
  PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
  PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
/**
 * A socket.io Encoder instance
 */


var Encoder = /*#__PURE__*/function () {
  function Encoder() {
    _classCallCheck(this, Encoder);
  }

  _createClass(Encoder, [{
    key: "encode",

    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     */
    value: function encode(obj) {
      debug("encoding packet %j", obj);

      if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
        if (is_binary_1.hasBinary(obj)) {
          obj.type = obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK;
          return this.encodeAsBinary(obj);
        }
      }

      return [this.encodeAsString(obj)];
    }
    /**
     * Encode packet as string.
     */

  }, {
    key: "encodeAsString",
    value: function encodeAsString(obj) {
      // first is type
      var str = "" + obj.type; // attachments if we have them

      if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
        str += obj.attachments + "-";
      } // if we have a namespace other than `/`
      // we append it followed by a comma `,`


      if (obj.nsp && "/" !== obj.nsp) {
        str += obj.nsp + ",";
      } // immediately followed by the id


      if (null != obj.id) {
        str += obj.id;
      } // json data


      if (null != obj.data) {
        str += JSON.stringify(obj.data);
      }

      debug("encoded %j as %s", obj, str);
      return str;
    }
    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     */

  }, {
    key: "encodeAsBinary",
    value: function encodeAsBinary(obj) {
      var deconstruction = binary_1.deconstructPacket(obj);
      var pack = this.encodeAsString(deconstruction.packet);
      var buffers = deconstruction.buffers;
      buffers.unshift(pack); // add packet info to beginning of data list

      return buffers; // write all the buffers
    }
  }]);

  return Encoder;
}();

exports.Encoder = Encoder;
/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 */

var Decoder = /*#__PURE__*/function (_Emitter) {
  _inherits(Decoder, _Emitter);

  var _super = _createSuper(Decoder);

  function Decoder() {
    _classCallCheck(this, Decoder);

    return _super.call(this);
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */


  _createClass(Decoder, [{
    key: "add",
    value: function add(obj) {
      var packet;

      if (typeof obj === "string") {
        packet = this.decodeString(obj);

        if (packet.type === PacketType.BINARY_EVENT || packet.type === PacketType.BINARY_ACK) {
          // binary packet's json
          this.reconstructor = new BinaryReconstructor(packet); // no attachments, labeled binary but no binary data to follow

          if (packet.attachments === 0) {
            _get(_getPrototypeOf(Decoder.prototype), "emit", this).call(this, "decoded", packet);
          }
        } else {
          // non-binary full packet
          _get(_getPrototypeOf(Decoder.prototype), "emit", this).call(this, "decoded", packet);
        }
      } else if (is_binary_1.isBinary(obj) || obj.base64) {
        // raw binary data
        if (!this.reconstructor) {
          throw new Error("got binary data when not reconstructing a packet");
        } else {
          packet = this.reconstructor.takeBinaryData(obj);

          if (packet) {
            // received final buffer
            this.reconstructor = null;

            _get(_getPrototypeOf(Decoder.prototype), "emit", this).call(this, "decoded", packet);
          }
        }
      } else {
        throw new Error("Unknown type: " + obj);
      }
    }
    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     */

  }, {
    key: "decodeString",
    value: function decodeString(str) {
      var i = 0; // look up type

      var p = {
        type: Number(str.charAt(0))
      };

      if (PacketType[p.type] === undefined) {
        throw new Error("unknown packet type " + p.type);
      } // look up attachments if type binary


      if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
        var start = i + 1;

        while (str.charAt(++i) !== "-" && i != str.length) {}

        var buf = str.substring(start, i);

        if (buf != Number(buf) || str.charAt(i) !== "-") {
          throw new Error("Illegal attachments");
        }

        p.attachments = Number(buf);
      } // look up namespace (if any)


      if ("/" === str.charAt(i + 1)) {
        var _start = i + 1;

        while (++i) {
          var c = str.charAt(i);
          if ("," === c) break;
          if (i === str.length) break;
        }

        p.nsp = str.substring(_start, i);
      } else {
        p.nsp = "/";
      } // look up id


      var next = str.charAt(i + 1);

      if ("" !== next && Number(next) == next) {
        var _start2 = i + 1;

        while (++i) {
          var _c = str.charAt(i);

          if (null == _c || Number(_c) != _c) {
            --i;
            break;
          }

          if (i === str.length) break;
        }

        p.id = Number(str.substring(_start2, i + 1));
      } // look up json data


      if (str.charAt(++i)) {
        var payload = tryParse(str.substr(i));

        if (Decoder.isPayloadValid(p.type, payload)) {
          p.data = payload;
        } else {
          throw new Error("invalid payload");
        }
      }

      debug("decoded %s as %j", str, p);
      return p;
    }
  }, {
    key: "destroy",

    /**
     * Deallocates a parser's resources
     */
    value: function destroy() {
      if (this.reconstructor) {
        this.reconstructor.finishedReconstruction();
      }
    }
  }], [{
    key: "isPayloadValid",
    value: function isPayloadValid(type, payload) {
      switch (type) {
        case PacketType.CONNECT:
          return _typeof(payload) === "object";

        case PacketType.DISCONNECT:
          return payload === undefined;

        case PacketType.CONNECT_ERROR:
          return typeof payload === "string" || _typeof(payload) === "object";

        case PacketType.EVENT:
        case PacketType.BINARY_EVENT:
          return Array.isArray(payload) && typeof payload[0] === "string";

        case PacketType.ACK:
        case PacketType.BINARY_ACK:
          return Array.isArray(payload);
      }
    }
  }]);

  return Decoder;
}(Emitter);

exports.Decoder = Decoder;

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return false;
  }
}
/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 */


var BinaryReconstructor = /*#__PURE__*/function () {
  function BinaryReconstructor(packet) {
    _classCallCheck(this, BinaryReconstructor);

    this.packet = packet;
    this.buffers = [];
    this.reconPack = packet;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */


  _createClass(BinaryReconstructor, [{
    key: "takeBinaryData",
    value: function takeBinaryData(binData) {
      this.buffers.push(binData);

      if (this.buffers.length === this.reconPack.attachments) {
        // done with buffer list
        var packet = binary_1.reconstructPacket(this.reconPack, this.buffers);
        this.finishedReconstruction();
        return packet;
      }

      return null;
    }
    /**
     * Cleans up binary packet reconstruction variables.
     */

  }, {
    key: "finishedReconstruction",
    value: function finishedReconstruction() {
      this.reconPack = null;
      this.buffers = [];
    }
  }]);

  return BinaryReconstructor;
}();
},{"component-emitter":"../node_modules/component-emitter/index.js","./binary":"../node_modules/socket.io-parser/dist/binary.js","./is-binary":"../node_modules/socket.io-parser/dist/is-binary.js","debug":"../node_modules/socket.io-parser/node_modules/debug/src/browser.js"}],"../node_modules/socket.io-client/build/on.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = void 0;

function on(obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function destroy() {
      obj.off(ev, fn);
    }
  };
}

exports.on = on;
},{}],"../node_modules/component-bind/index.js":[function(require,module,exports) {
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

},{}],"../node_modules/socket.io-client/build/socket.js":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Socket = void 0;

var socket_io_parser_1 = require("socket.io-parser");

var Emitter = require("component-emitter");

var on_1 = require("./on");

var bind = require("component-bind");

var debug = require("debug")("socket.io-client:socket");
/**
 * Internal events.
 * These events can't be emitted by the user.
 */


var RESERVED_EVENTS = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});

var Socket = /*#__PURE__*/function (_Emitter) {
  _inherits(Socket, _Emitter);

  var _super = _createSuper(Socket);

  /**
   * `Socket` constructor.
   *
   * @public
   */
  function Socket(io, nsp, opts) {
    var _this;

    _classCallCheck(this, Socket);

    _this = _super.call(this);
    _this.ids = 0;
    _this.acks = {};
    _this.receiveBuffer = [];
    _this.sendBuffer = [];
    _this.flags = {};
    _this.io = io;
    _this.nsp = nsp;
    _this.ids = 0;
    _this.acks = {};
    _this.receiveBuffer = [];
    _this.sendBuffer = [];
    _this.connected = false;
    _this.disconnected = true;
    _this.flags = {};

    if (opts && opts.auth) {
      _this.auth = opts.auth;
    }

    if (_this.io._autoConnect) _this.open();
    return _this;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */


  _createClass(Socket, [{
    key: "subEvents",
    value: function subEvents() {
      if (this.subs) return;
      var io = this.io;
      this.subs = [on_1.on(io, "open", bind(this, "onopen")), on_1.on(io, "packet", bind(this, "onpacket")), on_1.on(io, "close", bind(this, "onclose"))];
    }
    /**
     * Whether the Socket will try to reconnect when its Manager connects or reconnects
     */

  }, {
    key: "connect",

    /**
     * "Opens" the socket.
     *
     * @public
     */
    value: function connect() {
      if (this.connected) return this;
      this.subEvents();
      if (!this.io["_reconnecting"]) this.io.open(); // ensure open

      if ("open" === this.io._readyState) this.onopen();
      return this;
    }
    /**
     * Alias for connect()
     */

  }, {
    key: "open",
    value: function open() {
      return this.connect();
    }
    /**
     * Sends a `message` event.
     *
     * @return self
     * @public
     */

  }, {
    key: "send",
    value: function send() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.unshift("message");
      this.emit.apply(this, args);
      return this;
    }
    /**
     * Override `emit`.
     * If the event is in `events`, it's emitted normally.
     *
     * @param ev - event name
     * @return self
     * @public
     */

  }, {
    key: "emit",
    value: function emit(ev) {
      if (RESERVED_EVENTS.hasOwnProperty(ev)) {
        throw new Error('"' + ev + '" is a reserved event name');
      }

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      args.unshift(ev);
      var packet = {
        type: socket_io_parser_1.PacketType.EVENT,
        data: args
      };
      packet.options = {};
      packet.options.compress = this.flags.compress !== false; // event ack callback

      if ("function" === typeof args[args.length - 1]) {
        debug("emitting packet with ack id %d", this.ids);
        this.acks[this.ids] = args.pop();
        packet.id = this.ids++;
      }

      var isTransportWritable = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
      var discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);

      if (discardPacket) {
        debug("discard packet as the transport is not currently writable");
      } else if (this.connected) {
        this.packet(packet);
      } else {
        this.sendBuffer.push(packet);
      }

      this.flags = {};
      return this;
    }
    /**
     * Sends a packet.
     *
     * @param packet
     * @private
     */

  }, {
    key: "packet",
    value: function packet(_packet) {
      _packet.nsp = this.nsp;

      this.io._packet(_packet);
    }
    /**
     * Called upon engine `open`.
     *
     * @private
     */

  }, {
    key: "onopen",
    value: function onopen() {
      var _this2 = this;

      debug("transport is open - connecting");

      if (typeof this.auth == "function") {
        this.auth(function (data) {
          _this2.packet({
            type: socket_io_parser_1.PacketType.CONNECT,
            data: data
          });
        });
      } else {
        this.packet({
          type: socket_io_parser_1.PacketType.CONNECT,
          data: this.auth
        });
      }
    }
    /**
     * Called upon engine `close`.
     *
     * @param reason
     * @private
     */

  }, {
    key: "onclose",
    value: function onclose(reason) {
      debug("close (%s)", reason);
      this.connected = false;
      this.disconnected = true;
      delete this.id;

      _get(_getPrototypeOf(Socket.prototype), "emit", this).call(this, "disconnect", reason);
    }
    /**
     * Called with socket packet.
     *
     * @param packet
     * @private
     */

  }, {
    key: "onpacket",
    value: function onpacket(packet) {
      var sameNamespace = packet.nsp === this.nsp;
      if (!sameNamespace) return;

      switch (packet.type) {
        case socket_io_parser_1.PacketType.CONNECT:
          if (packet.data && packet.data.sid) {
            var id = packet.data.sid;
            this.onconnect(id);
          } else {
            _get(_getPrototypeOf(Socket.prototype), "emit", this).call(this, "connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          }

          break;

        case socket_io_parser_1.PacketType.EVENT:
          this.onevent(packet);
          break;

        case socket_io_parser_1.PacketType.BINARY_EVENT:
          this.onevent(packet);
          break;

        case socket_io_parser_1.PacketType.ACK:
          this.onack(packet);
          break;

        case socket_io_parser_1.PacketType.BINARY_ACK:
          this.onack(packet);
          break;

        case socket_io_parser_1.PacketType.DISCONNECT:
          this.ondisconnect();
          break;

        case socket_io_parser_1.PacketType.CONNECT_ERROR:
          var err = new Error(packet.data.message); // @ts-ignore

          err.data = packet.data.data;

          _get(_getPrototypeOf(Socket.prototype), "emit", this).call(this, "connect_error", err);

          break;
      }
    }
    /**
     * Called upon a server event.
     *
     * @param packet
     * @private
     */

  }, {
    key: "onevent",
    value: function onevent(packet) {
      var args = packet.data || [];
      debug("emitting event %j", args);

      if (null != packet.id) {
        debug("attaching ack callback to event");
        args.push(this.ack(packet.id));
      }

      if (this.connected) {
        this.emitEvent(args);
      } else {
        this.receiveBuffer.push(Object.freeze(args));
      }
    }
  }, {
    key: "emitEvent",
    value: function emitEvent(args) {
      if (this._anyListeners && this._anyListeners.length) {
        var listeners = this._anyListeners.slice();

        var _iterator = _createForOfIteratorHelper(listeners),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var listener = _step.value;
            listener.apply(this, args);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      _get(_getPrototypeOf(Socket.prototype), "emit", this).apply(this, args);
    }
    /**
     * Produces an ack callback to emit with an event.
     *
     * @private
     */

  }, {
    key: "ack",
    value: function ack(id) {
      var self = this;
      var sent = false;
      return function () {
        // prevent double callbacks
        if (sent) return;
        sent = true;

        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        debug("sending ack %j", args);
        self.packet({
          type: socket_io_parser_1.PacketType.ACK,
          id: id,
          data: args
        });
      };
    }
    /**
     * Called upon a server acknowlegement.
     *
     * @param packet
     * @private
     */

  }, {
    key: "onack",
    value: function onack(packet) {
      var ack = this.acks[packet.id];

      if ("function" === typeof ack) {
        debug("calling ack %s with %j", packet.id, packet.data);
        ack.apply(this, packet.data);
        delete this.acks[packet.id];
      } else {
        debug("bad ack %s", packet.id);
      }
    }
    /**
     * Called upon server connect.
     *
     * @private
     */

  }, {
    key: "onconnect",
    value: function onconnect(id) {
      debug("socket connected with id %s", id);
      this.id = id;
      this.connected = true;
      this.disconnected = false;

      _get(_getPrototypeOf(Socket.prototype), "emit", this).call(this, "connect");

      this.emitBuffered();
    }
    /**
     * Emit buffered events (received and emitted).
     *
     * @private
     */

  }, {
    key: "emitBuffered",
    value: function emitBuffered() {
      var _this3 = this;

      this.receiveBuffer.forEach(function (args) {
        return _this3.emitEvent(args);
      });
      this.receiveBuffer = [];
      this.sendBuffer.forEach(function (packet) {
        return _this3.packet(packet);
      });
      this.sendBuffer = [];
    }
    /**
     * Called upon server disconnect.
     *
     * @private
     */

  }, {
    key: "ondisconnect",
    value: function ondisconnect() {
      debug("server disconnect (%s)", this.nsp);
      this.destroy();
      this.onclose("io server disconnect");
    }
    /**
     * Called upon forced client/server side disconnections,
     * this method ensures the manager stops tracking us and
     * that reconnections don't get triggered for this.
     *
     * @private
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.subs) {
        // clean subscriptions to avoid reconnections
        for (var i = 0; i < this.subs.length; i++) {
          this.subs[i].destroy();
        }

        this.subs = null;
      }

      this.io["_destroy"](this);
    }
    /**
     * Disconnects the socket manually.
     *
     * @return self
     * @public
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this.connected) {
        debug("performing disconnect (%s)", this.nsp);
        this.packet({
          type: socket_io_parser_1.PacketType.DISCONNECT
        });
      } // remove socket from pool


      this.destroy();

      if (this.connected) {
        // fire events
        this.onclose("io client disconnect");
      }

      return this;
    }
    /**
     * Alias for disconnect()
     *
     * @return self
     * @public
     */

  }, {
    key: "close",
    value: function close() {
      return this.disconnect();
    }
    /**
     * Sets the compress flag.
     *
     * @param compress - if `true`, compresses the sending data
     * @return self
     * @public
     */

  }, {
    key: "compress",
    value: function compress(_compress) {
      this.flags.compress = _compress;
      return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
     * ready to send messages.
     *
     * @returns self
     * @public
     */

  }, {
    key: "onAny",

    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * @param listener
     * @public
     */
    value: function onAny(listener) {
      this._anyListeners = this._anyListeners || [];

      this._anyListeners.push(listener);

      return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * @param listener
     * @public
     */

  }, {
    key: "prependAny",
    value: function prependAny(listener) {
      this._anyListeners = this._anyListeners || [];

      this._anyListeners.unshift(listener);

      return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @param listener
     * @public
     */

  }, {
    key: "offAny",
    value: function offAny(listener) {
      if (!this._anyListeners) {
        return this;
      }

      if (listener) {
        var listeners = this._anyListeners;

        for (var i = 0; i < listeners.length; i++) {
          if (listener === listeners[i]) {
            listeners.splice(i, 1);
            return this;
          }
        }
      } else {
        this._anyListeners = [];
      }

      return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     *
     * @public
     */

  }, {
    key: "listenersAny",
    value: function listenersAny() {
      return this._anyListeners || [];
    }
  }, {
    key: "active",
    get: function get() {
      return !!this.subs;
    }
  }, {
    key: "volatile",
    get: function get() {
      this.flags.volatile = true;
      return this;
    }
  }]);

  return Socket;
}(Emitter);

exports.Socket = Socket;
},{"socket.io-parser":"../node_modules/socket.io-parser/dist/index.js","component-emitter":"../node_modules/component-emitter/index.js","./on":"../node_modules/socket.io-client/build/on.js","component-bind":"../node_modules/component-bind/index.js","debug":"../node_modules/socket.io-client/node_modules/debug/src/browser.js"}],"../node_modules/backo2/index.js":[function(require,module,exports) {

/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};


},{}],"../node_modules/socket.io-client/build/manager.js":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Manager = void 0;

var eio = require("engine.io-client");

var socket_1 = require("./socket");

var Emitter = require("component-emitter");

var parser = require("socket.io-parser");

var on_1 = require("./on");

var bind = require("component-bind");

var Backoff = require("backo2");

var debug = require("debug")("socket.io-client:manager");

var Manager = /*#__PURE__*/function (_Emitter) {
  _inherits(Manager, _Emitter);

  var _super = _createSuper(Manager);

  function Manager(uri, opts) {
    var _this;

    _classCallCheck(this, Manager);

    _this = _super.call(this);
    _this.nsps = {};
    _this.subs = [];

    if (uri && "object" === _typeof(uri)) {
      opts = uri;
      uri = undefined;
    }

    opts = opts || {};
    opts.path = opts.path || "/socket.io";
    _this.opts = opts;

    _this.reconnection(opts.reconnection !== false);

    _this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);

    _this.reconnectionDelay(opts.reconnectionDelay || 1000);

    _this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);

    _this.randomizationFactor(opts.randomizationFactor || 0.5);

    _this.backoff = new Backoff({
      min: _this.reconnectionDelay(),
      max: _this.reconnectionDelayMax(),
      jitter: _this.randomizationFactor()
    });

    _this.timeout(null == opts.timeout ? 20000 : opts.timeout);

    _this._readyState = "closed";
    _this.uri = uri;

    var _parser = opts.parser || parser;

    _this.encoder = new _parser.Encoder();
    _this.decoder = new _parser.Decoder();
    _this._autoConnect = opts.autoConnect !== false;
    if (_this._autoConnect) _this.open();
    return _this;
  }

  _createClass(Manager, [{
    key: "reconnection",
    value: function reconnection(v) {
      if (!arguments.length) return this._reconnection;
      this._reconnection = !!v;
      return this;
    }
  }, {
    key: "reconnectionAttempts",
    value: function reconnectionAttempts(v) {
      if (v === undefined) return this._reconnectionAttempts;
      this._reconnectionAttempts = v;
      return this;
    }
  }, {
    key: "reconnectionDelay",
    value: function reconnectionDelay(v) {
      var _a;

      if (v === undefined) return this._reconnectionDelay;
      this._reconnectionDelay = v;
      (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
      return this;
    }
  }, {
    key: "randomizationFactor",
    value: function randomizationFactor(v) {
      var _a;

      if (v === undefined) return this._randomizationFactor;
      this._randomizationFactor = v;
      (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
      return this;
    }
  }, {
    key: "reconnectionDelayMax",
    value: function reconnectionDelayMax(v) {
      var _a;

      if (v === undefined) return this._reconnectionDelayMax;
      this._reconnectionDelayMax = v;
      (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
      return this;
    }
  }, {
    key: "timeout",
    value: function timeout(v) {
      if (!arguments.length) return this._timeout;
      this._timeout = v;
      return this;
    }
    /**
     * Starts trying to reconnect if reconnection is enabled and we have not
     * started reconnecting yet
     *
     * @private
     */

  }, {
    key: "maybeReconnectOnOpen",
    value: function maybeReconnectOnOpen() {
      // Only try to reconnect if it's the first time we're connecting
      if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
        // keeps reconnection from firing twice for the same reconnection loop
        this.reconnect();
      }
    }
    /**
     * Sets the current transport `socket`.
     *
     * @param {Function} fn - optional, callback
     * @return self
     * @public
     */

  }, {
    key: "open",
    value: function open(fn) {
      var _this2 = this;

      debug("readyState %s", this._readyState);
      if (~this._readyState.indexOf("open")) return this;
      debug("opening %s", this.uri);
      this.engine = eio(this.uri, this.opts);
      var socket = this.engine;
      var self = this;
      this._readyState = "opening";
      this.skipReconnect = false; // emit `open`

      var openSub = on_1.on(socket, "open", function () {
        self.onopen();
        fn && fn();
      }); // emit `error`

      var errorSub = on_1.on(socket, "error", function (err) {
        debug("error");
        self.cleanup();
        self._readyState = "closed";

        _get(_getPrototypeOf(Manager.prototype), "emit", _this2).call(_this2, "error", err);

        if (fn) {
          fn(err);
        } else {
          // Only do this if there is no fn to handle the error
          self.maybeReconnectOnOpen();
        }
      });

      if (false !== this._timeout) {
        var timeout = this._timeout;
        debug("connect attempt will timeout after %d", timeout);

        if (timeout === 0) {
          openSub.destroy(); // prevents a race condition with the 'open' event
        } // set timer


        var timer = setTimeout(function () {
          debug("connect attempt timed out after %d", timeout);
          openSub.destroy();
          socket.close();
          socket.emit("error", new Error("timeout"));
        }, timeout);
        this.subs.push({
          destroy: function destroy() {
            clearTimeout(timer);
          }
        });
      }

      this.subs.push(openSub);
      this.subs.push(errorSub);
      return this;
    }
    /**
     * Alias for open()
     *
     * @return {Manager} self
     * @public
     */

  }, {
    key: "connect",
    value: function connect(fn) {
      return this.open(fn);
    }
    /**
     * Called upon transport open.
     *
     * @private
     */

  }, {
    key: "onopen",
    value: function onopen() {
      debug("open"); // clear old subs

      this.cleanup(); // mark as open

      this._readyState = "open";

      _get(_getPrototypeOf(Manager.prototype), "emit", this).call(this, "open"); // add new subs


      var socket = this.engine;
      this.subs.push(on_1.on(socket, "data", bind(this, "ondata")), on_1.on(socket, "ping", bind(this, "onping")), on_1.on(socket, "error", bind(this, "onerror")), on_1.on(socket, "close", bind(this, "onclose")), on_1.on(this.decoder, "decoded", bind(this, "ondecoded")));
    }
    /**
     * Called upon a ping.
     *
     * @private
     */

  }, {
    key: "onping",
    value: function onping() {
      _get(_getPrototypeOf(Manager.prototype), "emit", this).call(this, "ping");
    }
    /**
     * Called with data.
     *
     * @private
     */

  }, {
    key: "ondata",
    value: function ondata(data) {
      this.decoder.add(data);
    }
    /**
     * Called when parser fully decodes a packet.
     *
     * @private
     */

  }, {
    key: "ondecoded",
    value: function ondecoded(packet) {
      _get(_getPrototypeOf(Manager.prototype), "emit", this).call(this, "packet", packet);
    }
    /**
     * Called upon socket error.
     *
     * @private
     */

  }, {
    key: "onerror",
    value: function onerror(err) {
      debug("error", err);

      _get(_getPrototypeOf(Manager.prototype), "emit", this).call(this, "error", err);
    }
    /**
     * Creates a new socket for the given `nsp`.
     *
     * @return {Socket}
     * @public
     */

  }, {
    key: "socket",
    value: function socket(nsp, opts) {
      var socket = this.nsps[nsp];

      if (!socket) {
        socket = new socket_1.Socket(this, nsp, opts);
        this.nsps[nsp] = socket;
      }

      return socket;
    }
    /**
     * Called upon a socket close.
     *
     * @param socket
     * @private
     */

  }, {
    key: "_destroy",
    value: function _destroy(socket) {
      var nsps = Object.keys(this.nsps);

      for (var _i = 0, _nsps = nsps; _i < _nsps.length; _i++) {
        var nsp = _nsps[_i];
        var _socket = this.nsps[nsp];

        if (_socket.active) {
          debug("socket %s is still active, skipping close", nsp);
          return;
        }
      }

      this._close();
    }
    /**
     * Writes a packet.
     *
     * @param packet
     * @private
     */

  }, {
    key: "_packet",
    value: function _packet(packet) {
      debug("writing packet %j", packet);
      if (packet.query && packet.type === 0) packet.nsp += "?" + packet.query;
      var encodedPackets = this.encoder.encode(packet);

      for (var i = 0; i < encodedPackets.length; i++) {
        this.engine.write(encodedPackets[i], packet.options);
      }
    }
    /**
     * Clean up transport subscriptions and packet buffer.
     *
     * @private
     */

  }, {
    key: "cleanup",
    value: function cleanup() {
      debug("cleanup");
      var subsLength = this.subs.length;

      for (var i = 0; i < subsLength; i++) {
        var sub = this.subs.shift();
        sub.destroy();
      }

      this.decoder.destroy();
    }
    /**
     * Close the current socket.
     *
     * @private
     */

  }, {
    key: "_close",
    value: function _close() {
      debug("disconnect");
      this.skipReconnect = true;
      this._reconnecting = false;

      if ("opening" === this._readyState) {
        // `onclose` will not fire because
        // an open event never happened
        this.cleanup();
      }

      this.backoff.reset();
      this._readyState = "closed";
      if (this.engine) this.engine.close();
    }
    /**
     * Alias for close()
     *
     * @private
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      return this._close();
    }
    /**
     * Called upon engine close.
     *
     * @private
     */

  }, {
    key: "onclose",
    value: function onclose(reason) {
      debug("onclose");
      this.cleanup();
      this.backoff.reset();
      this._readyState = "closed";

      _get(_getPrototypeOf(Manager.prototype), "emit", this).call(this, "close", reason);

      if (this._reconnection && !this.skipReconnect) {
        this.reconnect();
      }
    }
    /**
     * Attempt a reconnection.
     *
     * @private
     */

  }, {
    key: "reconnect",
    value: function reconnect() {
      var _this3 = this;

      if (this._reconnecting || this.skipReconnect) return this;
      var self = this;

      if (this.backoff.attempts >= this._reconnectionAttempts) {
        debug("reconnect failed");
        this.backoff.reset();

        _get(_getPrototypeOf(Manager.prototype), "emit", this).call(this, "reconnect_failed");

        this._reconnecting = false;
      } else {
        var delay = this.backoff.duration();
        debug("will wait %dms before reconnect attempt", delay);
        this._reconnecting = true;
        var timer = setTimeout(function () {
          if (self.skipReconnect) return;
          debug("attempting reconnect");

          _get(_getPrototypeOf(Manager.prototype), "emit", _this3).call(_this3, "reconnect_attempt", self.backoff.attempts); // check again for the case socket closed in above events


          if (self.skipReconnect) return;
          self.open(function (err) {
            if (err) {
              debug("reconnect attempt error");
              self._reconnecting = false;
              self.reconnect();

              _get(_getPrototypeOf(Manager.prototype), "emit", _this3).call(_this3, "reconnect_error", err);
            } else {
              debug("reconnect success");
              self.onreconnect();
            }
          });
        }, delay);
        this.subs.push({
          destroy: function destroy() {
            clearTimeout(timer);
          }
        });
      }
    }
    /**
     * Called upon successful reconnect.
     *
     * @private
     */

  }, {
    key: "onreconnect",
    value: function onreconnect() {
      var attempt = this.backoff.attempts;
      this._reconnecting = false;
      this.backoff.reset();

      _get(_getPrototypeOf(Manager.prototype), "emit", this).call(this, "reconnect", attempt);
    }
  }]);

  return Manager;
}(Emitter);

exports.Manager = Manager;
},{"engine.io-client":"../node_modules/engine.io-client/lib/index.js","./socket":"../node_modules/socket.io-client/build/socket.js","component-emitter":"../node_modules/component-emitter/index.js","socket.io-parser":"../node_modules/socket.io-parser/dist/index.js","./on":"../node_modules/socket.io-client/build/on.js","component-bind":"../node_modules/component-bind/index.js","backo2":"../node_modules/backo2/index.js","debug":"../node_modules/socket.io-client/node_modules/debug/src/browser.js"}],"../node_modules/socket.io-client/build/index.js":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Socket = exports.io = exports.Manager = exports.protocol = void 0;

var url_1 = require("./url");

var manager_1 = require("./manager");

var socket_1 = require("./socket");

Object.defineProperty(exports, "Socket", {
  enumerable: true,
  get: function get() {
    return socket_1.Socket;
  }
});

var debug = require("debug")("socket.io-client");
/**
 * Module exports.
 */


module.exports = exports = lookup;
/**
 * Managers cache.
 */

var cache = exports.managers = {};

function lookup(uri, opts) {
  if (_typeof(uri) === "object") {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};
  var parsed = url_1.url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id]["nsps"];
  var newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
  var io;

  if (newConnection) {
    debug("ignoring socket cache for %s", source);
    io = new manager_1.Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug("new io instance for %s", source);
      cache[id] = new manager_1.Manager(source, opts);
    }

    io = cache[id];
  }

  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  }

  return io.socket(parsed.path, opts);
}

exports.io = lookup;
/**
 * Protocol version.
 *
 * @public
 */

var socket_io_parser_1 = require("socket.io-parser");

Object.defineProperty(exports, "protocol", {
  enumerable: true,
  get: function get() {
    return socket_io_parser_1.protocol;
  }
});
/**
 * `connect`.
 *
 * @param {String} uri
 * @public
 */

exports.connect = lookup;
/**
 * Expose constructors for standalone build.
 *
 * @public
 */

var manager_2 = require("./manager");

Object.defineProperty(exports, "Manager", {
  enumerable: true,
  get: function get() {
    return manager_2.Manager;
  }
});
},{"./url":"../node_modules/socket.io-client/build/url.js","./manager":"../node_modules/socket.io-client/build/manager.js","./socket":"../node_modules/socket.io-client/build/socket.js","debug":"../node_modules/socket.io-client/node_modules/debug/src/browser.js","socket.io-parser":"../node_modules/socket.io-parser/dist/index.js"}],"../node_modules/construct-ui/lib/esm/_shared/align.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Align = void 0;
var Align = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
};
exports.Align = Align;
},{}],"../node_modules/construct-ui/lib/esm/_shared/attrs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"../node_modules/construct-ui/lib/esm/_shared/classes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Classes = void 0;
var Classes = {
  // Modifiers
  XS: 'cui-xs',
  SM: 'cui-sm',
  LG: 'cui-lg',
  XL: 'cui-xl',
  PRIMARY: 'cui-primary',
  NEGATIVE: 'cui-negative',
  POSITIVE: 'cui-positive',
  WARNING: 'cui-warning',
  ACTIVE: 'cui-active',
  DISABLED: 'cui-disabled',
  LOADING: 'cui-loading',
  BASIC: 'cui-basic',
  OUTLINED: 'cui-outlined',
  ROUNDED: 'cui-rounded',
  READONLY: 'cui-readonly',
  SELECTED: 'cui-selected',
  INTERACTIVE: 'cui-interactive',
  ELEVATION: 'cui-elevation',
  HIDDEN: 'cui-hidden',
  // Headings
  H1: 'cui-h1',
  H2: 'cui-h2',
  H3: 'cui-h3',
  H4: 'cui-h4',
  H5: 'cui-h5',
  H6: 'cui-h6',
  // Utility
  ALIGN: 'cui-align',
  ALIGN_RIGHT: 'cui-align-right',
  ALIGN_LEFT: 'cui-align-left',
  FLUID: 'cui-fluid',
  TEXT_MUTED: 'cui-text-muted',
  TEXT_DISABLED: 'cui-text-disabled',
  FOCUS_DISABLED: 'cui-focus-disabled',
  COMPACT: 'cui-compact',
  // Component
  BREADCRUMB: 'cui-breadcrumb',
  BREADCRUMB_ITEM: 'cui-breadcrumb-item',
  BREADCRUMB_SEPERATOR: 'cui-breadcrumb-seperator',
  BUTTON: 'cui-button',
  BUTTON_LABEL: 'cui-button-label',
  BUTTON_SUBLABEL: 'cui-button-sublabel',
  BUTTON_GROUP: 'cui-button-group',
  BUTTON_ICON: 'cui-button-icon',
  CARD: 'cui-card',
  CARD_INTERACTIVE: 'cui-card-interactive',
  CALLOUT: 'cui-callout',
  CALLOUT_HEADER: 'cui-callout-header',
  CALLOUT_CONTENT: 'cui-callout-content',
  CALLOUT_ICON: 'cui-callout-icon',
  CALLOUT_DISMISS_ICON: 'cui-callout-dismiss',
  CHECKBOX: 'cui-checkbox',
  COLLAPSE: 'cui-collapse',
  COLLAPSE_BODY: 'cui-collapse-body',
  CONTEXT_MENU: 'cui-context-menu',
  CONTROL: 'cui-control',
  CONTROL_INDICATOR: 'cui-control-indicator',
  CONTROL_GROUP: 'cui-control-group',
  CUSTOM_SELECT: 'cui-custom-select',
  CUSTOM_SELECT_TRIGGER: 'cui-custom-select-trigger',
  CUSTOM_SELECT_INPUT: 'cui-custom-select-input',
  CUSTOM_SELECT_HIDDEN: 'cui-custom-select-hidden',
  DIALOG: 'cui-dialog',
  DIALOG_CLOSE_BUTTON: 'cui-dialog-close-button',
  DIALOG_CONTENT: 'cui-dialog-content',
  DIALOG_HEADER: 'cui-dialog-header',
  DIALOG_BODY: 'cui-dialog-body',
  DIALOG_FOOTER: 'cui-dialog-footer',
  DRAWER: 'cui-drawer',
  DRAWER_CONTENT: 'cui-drawer-content',
  EMPTY_STATE: 'cui-empty-state',
  EMPTY_STATE_ICON: 'cui-empty-state-icon',
  EMPTY_STATE_CONTENT: 'cui-empty-state-content',
  EMPTY_STATE_HEADER: 'cui-empty-state-header',
  EMPTY_STATE_FILL: 'cui-empty-state-fill',
  FORM: 'cui-form',
  FORM_GROUP: 'cui-form-group',
  FORM_LABEL: 'cui-form-label',
  GRID: 'cui-grid',
  COL: 'cui-col',
  INPUT_FILE: 'cui-input-file',
  INPUT_FILE_CONTENT: 'cui-input-file-content',
  INPUT_FILE_TEXT: 'cui-input-file-text',
  INPUT_FILE_BUTTON: 'cui-input-file-button',
  ICON: 'cui-icon',
  ICON_ACTION: 'cui-icon-action',
  INPUT: 'cui-input',
  INPUT_GROUP: 'cui-input-group',
  INPUT_POPOVER: 'cui-input-popover',
  INPUT_POPOVER_CONTENT: 'cui-input-popover-content',
  INPUT_SELECT: 'cui-input-select',
  LIST: 'cui-list',
  LIST_ITEM: 'cui-list-item',
  LIST_ITEM_LABEL: 'cui-list-item-label',
  LIST_ITEM_CONTENT_LEFT: 'cui-list-item-content-left',
  LIST_ITEM_CONTENT_RIGHT: 'cui-list-item-content-right',
  MENU: 'cui-menu',
  MENU_ITEM: 'cui-menu-item',
  MENU_DIVIDER: 'cui-menu-divider',
  MENU_HEADING: 'cui-menu-heading',
  OVERLAY: 'cui-overlay',
  OVERLAY_CONTENT: 'cui-overlay-content',
  OVERLAY_BACKDROP: 'cui-overlay-backdrop',
  OVERLAY_OPEN: 'cui-overlay-open',
  OVERLAY_INLINE: 'cui-overlay-inline',
  OVERLAY_SCROLL_CONTAINER: 'cui-overlay-scroll-container',
  POPOVER: 'cui-popover',
  POPOVER_OPEN: 'cui-popover-open',
  POPOVER_CONTENT: 'cui-popover-content',
  POPOVER_ARROW: 'cui-popover-arrow',
  POPOVER_TRIGGER_ACTIVE: 'cui-popover-trigger-active',
  POPOVER_BACKDROP: 'cui-popover-backdrop',
  POPOVER_DISSMISS: 'cui-popover-dismiss',
  POPOVER_MENU: 'cui-popover-menu',
  PORTAL: 'cui-portal',
  QUERY_LIST: 'cui-query-list',
  QUERY_LIST_CHECKMARK: 'cui-query-list-checkmark',
  QUERY_LIST_EMPTY: 'cui-query-list-empty',
  QUERY_LIST_INITIAL: 'cui-query-list-initial',
  QUERY_LIST_MESSAGE: 'cui-query-list-message',
  RADIO: 'cui-radio',
  RADIO_GROUP: 'cui-radio-group',
  SELECT: 'cui-select',
  SELECT_ARROW: 'cui-select-arrow',
  SELECT_LIST: 'cui-select-list',
  SPINNER: 'cui-spinner',
  SPINNER_CONTENT: 'cui-spinner-content',
  SPINNER_ICON: 'cui-spinner-icon',
  SPINNER_MESSAGE: 'cui-spinner-message',
  SPINNER_FILL: 'cui-spinner-fill',
  SPINNER_ACTIVE: 'cui-spinner-active',
  SPINNER_BG: 'cui-spinner-bg',
  SWITCH: 'cui-switch',
  TABLE: 'cui-table',
  TABLE_BORDERED: 'cui-table-bordered',
  TABLE_STRIPED: 'cui-table-striped',
  TABLE_INTERACTIVE: 'cui-table-interactive',
  TAG: 'cui-tag',
  TAG_REMOVABLE: 'cui-tag-removable',
  TAG_INPUT: 'cui-tag-input',
  TAG_INPUT_VALUES: 'cui-tag-input-values',
  TABS: 'cui-tabs',
  TABS_BORDERED: 'cui-tabs-bordered',
  TABS_ITEM: 'cui-tabs-item',
  TEXT_AREA: 'cui-text-area',
  TOAST: 'cui-toast',
  TOAST_MESSAGE: 'cui-toast-message',
  TOASTER: 'cui-toaster',
  TOASTER_INLINE: 'cui-toaster-inline',
  TOOLTIP: 'cui-tooltip',
  TREE: 'cui-tree',
  TREE_NODE: 'cui-tree-node',
  TREE_NODE_LIST: 'cui-tree-node-list',
  TREE_NODE_CONTENT: 'cui-tree-node-content',
  TREE_NODE_CARET: 'cui-tree-node-caret',
  TREE_NODE_CARET_OPEN: 'cui-tree-node-caret-open',
  TREE_NODE_CARET_CLOSED: 'cui-tree-node-caret-closed',
  TREE_NODE_CARET_NONE: 'cui-tree-node-caret-none',
  TREE_NODE_SELECTED: 'cui-tree-node-selected',
  TREE_NODE_EXPANDED: 'cui-tree-node-expanded',
  TREE_NODE_LABEL: 'cui-tree-node-label',
  TREE_NODE_CONTENT_RIGHT: 'cui-tree-node-content-right',
  TREE_NODE_CONTENT_LEFT: 'cui-tree-node-content-left'
};
exports.Classes = Classes;
},{}],"../node_modules/construct-ui/lib/esm/_shared/colors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Colors = void 0;
var Colors = {
  // Grescale colors
  WHITE: '#FFFFFF',
  GREY50: '#FAFAFA',
  GREY100: '#F5F5F5',
  GREY200: '#EEEEEE',
  GREY300: '#E0E0E0',
  GREY400: '#BDBDBD',
  GREY500: '#9E9E9E',
  GREY600: '#757575',
  GREY700: '#616161',
  GREY800: '#424242',
  GREY900: '#212121',
  BLUE_GREY50: '#E4E9EB',
  BLUE_GREY100: '#CFD8DC',
  BLUE_GREY200: '#B0BEC5',
  BLUE_GREY300: '#90A4AE',
  BLUE_GREY400: '#78909C',
  BLUE_GREY500: '#607D8B',
  BLUE_GREY600: '#546E7A',
  BLUE_GREY700: '#455A64',
  BLUE_GREY800: '#37474F',
  BLUE_GREY900: '#263238',
  // CORE COLORS
  RED50: '#FFEBEE',
  RED100: '#FFCDD2',
  RED200: '#EF9A9A',
  RED300: '#E57373',
  RED400: '#EF5350',
  RED500: '#F44336',
  RED600: '#E53935',
  RED700: '#D32F2F',
  RED800: '#C62828',
  RED900: '#B71C1C',
  PURPLE50: '#F3E5F5',
  PURPLE100: '#E1BEE7',
  PURPLE200: '#CE93D8',
  PURPLE300: '#BA68C8',
  PURPLE400: '#AB47BC',
  PURPLE500: '#9C27B0',
  PURPLE600: '#8E24AA',
  PURPLE700: '#7B1FA2',
  PURPLE800: '#6A1B9A',
  PURPLE900: '#4A148C',
  DEEP_PURPLE50: '#EDE7F6',
  DEEP_PURPLE100: '#D1C4E9',
  DEEP_PURPLE200: '#B39DDB',
  DEEP_PURPLE300: '#9575CD',
  DEEP_PURPLE400: '#7E57C2',
  DEEP_PURPLE500: '#673AB7',
  DEEP_PURPLE600: '#5E35B1',
  DEEP_PURPLE700: '#512DA8',
  DEEP_PURPLE800: '#4527A0',
  DEEP_PURPLE900: '#311B92',
  INDIGO50: '#E8EAF6',
  INDIGO100: '#C5CAE9',
  INDIGO200: '#9FA8DA',
  INDIGO300: '#7986CB',
  INDIGO400: '#5C6BC0',
  INDIGO500: '#3F51B5',
  INDIGO600: '#3949AB',
  INDIGO700: '#303F9F',
  INDIGO800: '#283593',
  INDIGO900: '#1A237E',
  BLUE50: '#E3F2FD',
  BLUE100: '#BBDEFB',
  BLUE200: '#90CAF9',
  BLUE300: '#64B5F6',
  BLUE400: '#42A5F5',
  BLUE500: '#2196F3',
  BLUE600: '#1E88E5',
  BLUE700: '#1976D2',
  BLUE800: '#1565C0',
  BLUE900: '#0D47A1',
  LIGHT_BLUE50: '#E1F5FE',
  LIGHT_BLUE100: '#B3E5FC',
  LIGHT_BLUE200: '#81D4FA',
  LIGHT_BLUE300: '#4FC3F7',
  LIGHT_BLUE400: '#29B6F6',
  LIGHT_BLUE500: '#03A9F4',
  LIGHT_BLUE600: '#039BE5',
  LIGHT_BLUE700: '#0288D1',
  LIGHT_BLUE800: '#0277BD',
  LIGHT_BLUE900: '#01579B',
  CYAN50: '#E0F7FA',
  CYAN100: '#B2EBF2',
  CYAN200: '#80DEEA',
  CYAN300: '#4DD0E1',
  CYAN400: '#26C6DA',
  CYAN500: '#00BCD4',
  CYAN600: '#00ACC1',
  CYAN700: '#0097A7',
  CYAN800: '#00838F',
  CYAN900: '#006064',
  TEAL50: '#E0F2F1',
  TEAL100: '#B2DFDB',
  TEAL200: '#80CBC4',
  TEAL300: '#4DB6AC',
  TEAL400: '#26A69A',
  TEAL500: '#009688',
  TEAL600: '#00897B',
  TEAL700: '#00796B',
  TEAL800: '#00695C',
  TEAL900: '#004D40',
  GREEN50: '#E8F5E9',
  GREEN100: '#C8E6C9',
  GREEN200: '#A5D6A7',
  GREEN300: '#81C784',
  GREEN400: '#66BB6A',
  GREEN500: '#4CAF50',
  GREEN600: '#43A047',
  GREEN700: '#388E3C',
  GREEN800: '#2E7D32',
  GREEN900: '#1B5E20',
  LIGHT_GREEN50: '#F1F8E9',
  LIGHT_GREEN100: '#DCEDC8',
  LIGHT_GREEN200: '#C5E1A5',
  LIGHT_GREEN300: '#AED581',
  LIGHT_GREEN400: '#9CCC65',
  LIGHT_GREEN500: '#8BC34A',
  LIGHT_GREEN600: '#7CB342',
  LIGHT_GREEN700: '#689F38',
  LIGHT_GREEN800: '#558B2F',
  LIGHT_GREEN900: '#33691E',
  ORANGE50: '#FFF3E0',
  ORANGE100: '#FFE0B2',
  ORANGE200: '#FFCC80',
  ORANGE300: '#FFB74D',
  ORANGE400: '#FFA726',
  ORANGE500: '#FF9800',
  ORANGE600: '#FB8C00',
  ORANGE700: '#F57C00',
  ORANGE800: '#EF6C00',
  ORANGE900: '#E65100'
};
exports.Colors = Colors;
},{}],"../node_modules/construct-ui/lib/esm/_shared/intents.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Intent = void 0;
var Intent = {
  NONE: 'none',
  PRIMARY: 'primary',
  NEGATIVE: 'negative',
  POSITIVE: 'positive',
  WARNING: 'warning'
};
exports.Intent = Intent;
},{}],"../node_modules/construct-ui/lib/esm/_shared/keys.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keys = void 0;
var Keys = {
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  ESCAPE: 27,
  SPACE: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40
};
exports.Keys = Keys;
},{}],"../node_modules/construct-ui/lib/esm/_shared/responsive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Breakpoints = void 0;
var Breakpoints = {
  xs: '(max-width: 575.98px)',
  sm: '(min-width: 576px) and (max-width: 767.98px)',
  md: '(min-width: 768px) and (max-width: 991.98px)',
  lg: '(min-width: 992px) and (max-width: 1199.98px)',
  xl: '(min-width: 1200px)'
};
exports.Breakpoints = Breakpoints;
},{}],"../node_modules/construct-ui/lib/esm/_shared/sizes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Size = void 0;
var Size = {
  XS: 'xs',
  SM: 'sm',
  DEFAULT: 'default',
  LG: 'lg',
  XL: 'xl'
};
exports.Size = Size;
},{}],"../node_modules/construct-ui/lib/esm/_shared/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFunction = isFunction;
exports.safeCall = safeCall;
exports.getClosest = getClosest;
exports.getScrollbarWidth = getScrollbarWidth;
exports.hasScrollbar = hasScrollbar;
exports.elementIsOrContains = elementIsOrContains;
exports.normalizeStyle = normalizeStyle;
exports.updateElementGroupPadding = updateElementGroupPadding;
exports.isNullOrEmpty = isNullOrEmpty;

var _ = require(".");

function isFunction(value) {
  return typeof value === 'function';
}

function safeCall(func) {
  var args = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }

  if (isFunction(func)) {
    return func.apply(void 0, args);
  }
}

function getClosest(el, selector) {
  if (el.matches(selector)) return el;

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector ||
    /* tslint:disable */
    function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s);
      var i = matches.length;

      while (--i >= 0 && matches.item(i) !== this) {}

      return i > -1;
    };
    /* tslint:enable */

  }

  for (; el && el !== document; el = el.parentNode) {
    if (el.matches(selector)) return el;
  }

  return null;
}

function getScrollbarWidth() {
  var el = document.createElement('div');
  el.style.width = '100px';
  el.style.height = '100px';
  el.style.overflow = 'scroll';
  el.style.position = 'absolute';
  el.style.top = '-9999px';
  document.body.appendChild(el);
  var scrollbarWidth = el.offsetWidth - el.clientWidth;
  document.body.removeChild(el);
  return scrollbarWidth;
}

function hasScrollbar(el) {
  return el.scrollHeight > window.innerHeight;
}

function elementIsOrContains(element, testElement) {
  return element === testElement || element.contains(testElement);
}

function normalizeStyle(style) {
  if (typeof style === 'string') {
    var result = {};
    var attributes = style.replace(/\s/g, '').split(';');

    for (var i = 0; i < attributes.length; i++) {
      var entry = attributes[i].split(':');
      result[entry.splice(0, 1)[0]] = entry.join(':');
    }

    return result;
  } else return style;
}

function updateElementGroupPadding(containerEl, contentLeft, contentRight) {
  if (!containerEl) return;
  var containerPadding = Math.floor(containerEl.clientHeight / 1.6);

  if (contentLeft) {
    var contentLeftEl = contentLeft.dom;
    containerEl.style.paddingLeft = shouldAddPadding(contentLeftEl) ? contentLeftEl.clientWidth + containerPadding + "px" : '';
  } else containerEl.style.paddingLeft = '';

  if (contentRight) {
    var contentRightEl = contentRight.dom;
    containerEl.style.paddingRight = shouldAddPadding(contentRightEl) ? contentRightEl.clientWidth + containerPadding + "px" : '';
  } else containerEl.style.paddingRight = '';
}

function shouldAddPadding(element) {
  return element && !element.classList.contains(_.Classes.ICON) && !element.classList.contains(_.Classes.SPINNER) && !element.classList.contains(_.Classes.BUTTON_ICON);
}

function isNullOrEmpty(item) {
  return item == null || item === '' || item === false;
}
},{".":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/_shared/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Classes: true,
  Colors: true
};
Object.defineProperty(exports, "Classes", {
  enumerable: true,
  get: function () {
    return _classes.Classes;
  }
});
Object.defineProperty(exports, "Colors", {
  enumerable: true,
  get: function () {
    return _colors.Colors;
  }
});

var _align = require("./align");

Object.keys(_align).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _align[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _align[key];
    }
  });
});

var _attrs = require("./attrs");

Object.keys(_attrs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _attrs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _attrs[key];
    }
  });
});

var _classes = require("./classes");

var _colors = require("./colors");

var _intents = require("./intents");

Object.keys(_intents).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _intents[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _intents[key];
    }
  });
});

var _keys = require("./keys");

Object.keys(_keys).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _keys[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _keys[key];
    }
  });
});

var _responsive = require("./responsive");

Object.keys(_responsive).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _responsive[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _responsive[key];
    }
  });
});

var _sizes = require("./sizes");

Object.keys(_sizes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _sizes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sizes[key];
    }
  });
});

var _utils = require("./utils");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _utils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _utils[key];
    }
  });
});
},{"./align":"../node_modules/construct-ui/lib/esm/_shared/align.js","./attrs":"../node_modules/construct-ui/lib/esm/_shared/attrs.js","./classes":"../node_modules/construct-ui/lib/esm/_shared/classes.js","./colors":"../node_modules/construct-ui/lib/esm/_shared/colors.js","./intents":"../node_modules/construct-ui/lib/esm/_shared/intents.js","./keys":"../node_modules/construct-ui/lib/esm/_shared/keys.js","./responsive":"../node_modules/construct-ui/lib/esm/_shared/responsive.js","./sizes":"../node_modules/construct-ui/lib/esm/_shared/sizes.js","./utils":"../node_modules/construct-ui/lib/esm/_shared/utils.js"}],"../node_modules/tslib/tslib.es6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__extends = __extends;
exports.__rest = __rest;
exports.__decorate = __decorate;
exports.__param = __param;
exports.__metadata = __metadata;
exports.__awaiter = __awaiter;
exports.__generator = __generator;
exports.__exportStar = __exportStar;
exports.__values = __values;
exports.__read = __read;
exports.__spread = __spread;
exports.__spreadArrays = __spreadArrays;
exports.__await = __await;
exports.__asyncGenerator = __asyncGenerator;
exports.__asyncDelegator = __asyncDelegator;
exports.__asyncValues = __asyncValues;
exports.__makeTemplateObject = __makeTemplateObject;
exports.__importStar = __importStar;
exports.__importDefault = __importDefault;
exports.__classPrivateFieldGet = __classPrivateFieldGet;
exports.__classPrivateFieldSet = __classPrivateFieldSet;
exports.__createBinding = exports.__assign = void 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function () {
  exports.__assign = __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__assign = __assign;

function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
}

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

var __createBinding = Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
};

exports.__createBinding = __createBinding;

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}

function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}

;

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;

  function verb(n) {
    if (g[n]) i[n] = function (v) {
      return new Promise(function (a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }

  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }

  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }

  function fulfill(value) {
    resume("next", value);
  }

  function reject(value) {
    resume("throw", value);
  }

  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function () {
    return this;
  }, i;

  function verb(n, f) {
    i[n] = o[n] ? function (v) {
      return (p = !p) ? {
        value: __await(o[n](v)),
        done: n === "return"
      } : f ? f(v) : v;
    } : f;
  }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
}

;

var __setModuleDefault = Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
}

function __importDefault(mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
}

function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  privateMap.set(receiver, value);
  return value;
}
},{}],"../node_modules/classnames/index.js":[function(require,module,exports) {
var define;
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],"../node_modules/construct-ui/lib/esm/components/breadcrumb/Breadcrumb.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Breadcrumb = void 0;

var _tslib = require("tslib");

var _classnames = _interopRequireDefault(require("classnames"));

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Breadcrumb =
/** @class */
function () {
  function Breadcrumb() {}

  Breadcrumb.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var className = attrs.class,
        _b = attrs.seperator,
        seperator = _b === void 0 ? '/' : _b,
        size = attrs.size,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "seperator", "size"]);
    var classes = (0, _classnames.default)(_shared.Classes.BREADCRUMB, size && "cui-" + size, className);
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes
    }), this.renderChildren(children, attrs));
  };

  Breadcrumb.prototype.renderChildren = function (children, _a) {
    var seperator = _a.seperator;
    return children.filter(function (item) {
      return item != null;
    }).map(function (item) {
      return [item, (0, _mithril.default)("span." + _shared.Classes.BREADCRUMB_SEPERATOR, seperator)];
    });
  };

  return Breadcrumb;
}();

exports.Breadcrumb = Breadcrumb;
},{"tslib":"../node_modules/tslib/tslib.es6.js","classnames":"../node_modules/classnames/index.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/breadcrumb/BreadcrumbItem.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BreadcrumbItem = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BreadcrumbItem =
/** @class */
function () {
  function BreadcrumbItem() {}

  BreadcrumbItem.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var className = attrs.class,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class"]);
    var tag = htmlAttrs.href != null ? 'a' : 'span';
    var classes = (0, _classnames.default)(_shared.Classes.BREADCRUMB_ITEM, className);
    return (0, _mithril.default)(tag, (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes
    }), children);
  };

  return BreadcrumbItem;
}();

exports.BreadcrumbItem = BreadcrumbItem;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/breadcrumb/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Breadcrumb = require("./Breadcrumb");

Object.keys(_Breadcrumb).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Breadcrumb[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Breadcrumb[key];
    }
  });
});

var _BreadcrumbItem = require("./BreadcrumbItem");

Object.keys(_BreadcrumbItem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _BreadcrumbItem[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _BreadcrumbItem[key];
    }
  });
});
},{"./Breadcrumb":"../node_modules/construct-ui/lib/esm/components/breadcrumb/Breadcrumb.js","./BreadcrumbItem":"../node_modules/construct-ui/lib/esm/components/breadcrumb/BreadcrumbItem.js"}],"../node_modules/construct-ui/lib/esm/components/icon/generated/IconNames.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EYE_OFF = exports.EXTERNAL_LINK = exports.EDIT = exports.EDIT_3 = exports.EDIT_2 = exports.DROPLET = exports.DRIBBBLE = exports.DOWNLOAD = exports.DOWNLOAD_CLOUD = exports.DOLLAR_SIGN = exports.DIVIDE = exports.DIVIDE_SQUARE = exports.DIVIDE_CIRCLE = exports.DISC = exports.DELETE = exports.DATABASE = exports.CROSSHAIR = exports.CROP = exports.CREDIT_CARD = exports.CPU = exports.CORNER_UP_RIGHT = exports.CORNER_UP_LEFT = exports.CORNER_RIGHT_UP = exports.CORNER_RIGHT_DOWN = exports.CORNER_LEFT_UP = exports.CORNER_LEFT_DOWN = exports.CORNER_DOWN_RIGHT = exports.CORNER_DOWN_LEFT = exports.COPY = exports.COMPASS = exports.COMMAND = exports.COLUMNS = exports.COFFEE = exports.CODESANDBOX = exports.CODEPEN = exports.CODE = exports.CLOUD = exports.CLOUD_SNOW = exports.CLOUD_RAIN = exports.CLOUD_OFF = exports.CLOUD_LIGHTNING = exports.CLOUD_DRIZZLE = exports.CLOCK = exports.CLIPBOARD = exports.CIRCLE = exports.CHROME = exports.CHEVRONS_UP = exports.CHEVRONS_RIGHT = exports.CHEVRONS_LEFT = exports.CHEVRONS_DOWN = exports.CHEVRON_UP = exports.CHEVRON_RIGHT = exports.CHEVRON_LEFT = exports.CHEVRON_DOWN = exports.CHECK = exports.CHECK_SQUARE = exports.CHECK_CIRCLE = exports.CAST = exports.CAMERA = exports.CAMERA_OFF = exports.CALENDAR = exports.BRIEFCASE = exports.BOX = exports.BOOKMARK = exports.BOOK = exports.BOOK_OPEN = exports.BOLD = exports.BLUETOOTH = exports.BELL = exports.BELL_OFF = exports.BATTERY = exports.BATTERY_CHARGING = exports.BAR_CHART = exports.BAR_CHART_2 = exports.AWARD = exports.AT_SIGN = exports.ARROW_UP = exports.ARROW_UP_RIGHT = exports.ARROW_UP_LEFT = exports.ARROW_UP_CIRCLE = exports.ARROW_RIGHT = exports.ARROW_RIGHT_CIRCLE = exports.ARROW_LEFT = exports.ARROW_LEFT_CIRCLE = exports.ARROW_DOWN = exports.ARROW_DOWN_RIGHT = exports.ARROW_DOWN_LEFT = exports.ARROW_DOWN_CIRCLE = exports.ARCHIVE = exports.APERTURE = exports.ANCHOR = exports.ALIGN_RIGHT = exports.ALIGN_LEFT = exports.ALIGN_JUSTIFY = exports.ALIGN_CENTER = exports.ALERT_TRIANGLE = exports.ALERT_OCTAGON = exports.ALERT_CIRCLE = exports.AIRPLAY = exports.ACTIVITY = void 0;
exports.REFRESH_CCW = exports.RADIO = exports.PRINTER = exports.POWER = exports.POCKET = exports.PLUS = exports.PLUS_SQUARE = exports.PLUS_CIRCLE = exports.PLAY = exports.PLAY_CIRCLE = exports.PIE_CHART = exports.PHONE = exports.PHONE_OUTGOING = exports.PHONE_OFF = exports.PHONE_MISSED = exports.PHONE_INCOMING = exports.PHONE_FORWARDED = exports.PHONE_CALL = exports.PERCENT = exports.PEN_TOOL = exports.PAUSE = exports.PAUSE_CIRCLE = exports.PAPERCLIP = exports.PACKAGE = exports.OCTAGON = exports.NAVIGATION = exports.NAVIGATION_2 = exports.MUSIC = exports.MOVE = exports.MOUSE_POINTER = exports.MORE_VERTICAL = exports.MORE_HORIZONTAL = exports.MOON = exports.MONITOR = exports.MINUS = exports.MINUS_SQUARE = exports.MINUS_CIRCLE = exports.MINIMIZE = exports.MINIMIZE_2 = exports.MIC = exports.MIC_OFF = exports.MESSAGE_SQUARE = exports.MESSAGE_CIRCLE = exports.MENU = exports.MEH = exports.MAXIMIZE = exports.MAXIMIZE_2 = exports.MAP = exports.MAP_PIN = exports.MAIL = exports.LOG_OUT = exports.LOG_IN = exports.LOCK = exports.LOADER = exports.LIST = exports.LINKEDIN = exports.LINK = exports.LINK_2 = exports.LIFE_BUOY = exports.LAYOUT = exports.LAYERS = exports.KEY = exports.ITALIC = exports.INSTAGRAM = exports.INFO = exports.INBOX = exports.IMAGE = exports.HOME = exports.HEXAGON = exports.HELP_CIRCLE = exports.HEART = exports.HEADPHONES = exports.HASH = exports.HARD_DRIVE = exports.GRID = exports.GLOBE = exports.GITLAB = exports.GITHUB = exports.GIT_PULL_REQUEST = exports.GIT_MERGE = exports.GIT_COMMIT = exports.GIT_BRANCH = exports.GIFT = exports.FROWN = exports.FRAMER = exports.FOLDER = exports.FOLDER_PLUS = exports.FOLDER_MINUS = exports.FLAG = exports.FILTER = exports.FILM = exports.FILE = exports.FILE_TEXT = exports.FILE_PLUS = exports.FILE_MINUS = exports.FIGMA = exports.FEATHER = exports.FAST_FORWARD = exports.FACEBOOK = exports.EYE = void 0;
exports.ZOOM_OUT = exports.ZOOM_IN = exports.ZAP = exports.ZAP_OFF = exports.YOUTUBE = exports.X = exports.X_SQUARE = exports.X_OCTAGON = exports.X_CIRCLE = exports.WIND = exports.WIFI = exports.WIFI_OFF = exports.WATCH = exports.VOLUME = exports.VOLUME_X = exports.VOLUME_2 = exports.VOLUME_1 = exports.VOICEMAIL = exports.VIDEO = exports.VIDEO_OFF = exports.USERS = exports.USER = exports.USER_X = exports.USER_PLUS = exports.USER_MINUS = exports.USER_CHECK = exports.UPLOAD = exports.UPLOAD_CLOUD = exports.UNLOCK = exports.UNDERLINE = exports.UMBRELLA = exports.TYPE = exports.TWITTER = exports.TWITCH = exports.TV = exports.TRUCK = exports.TRIANGLE = exports.TRENDING_UP = exports.TRENDING_DOWN = exports.TRELLO = exports.TRASH = exports.TRASH_2 = exports.TOOL = exports.TOGGLE_RIGHT = exports.TOGGLE_LEFT = exports.THUMBS_UP = exports.THUMBS_DOWN = exports.THERMOMETER = exports.TERMINAL = exports.TARGET = exports.TAG = exports.TABLET = exports.SUNSET = exports.SUNRISE = exports.SUN = exports.STOP_CIRCLE = exports.STAR = exports.SQUARE = exports.SPEAKER = exports.SMILE = exports.SMARTPHONE = exports.SLIDERS = exports.SLASH = exports.SLACK = exports.SKIP_FORWARD = exports.SKIP_BACK = exports.SIDEBAR = exports.SHUFFLE = exports.SHOPPING_CART = exports.SHOPPING_BAG = exports.SHIELD = exports.SHIELD_OFF = exports.SHARE = exports.SHARE_2 = exports.SETTINGS = exports.SERVER = exports.SEND = exports.SEARCH = exports.SCISSORS = exports.SAVE = exports.RSS = exports.ROTATE_CW = exports.ROTATE_CCW = exports.REWIND = exports.REPEAT = exports.REFRESH_CW = void 0;

/* tslint:disable */
var ACTIVITY = 'activity';
exports.ACTIVITY = ACTIVITY;
var AIRPLAY = 'airplay';
exports.AIRPLAY = AIRPLAY;
var ALERT_CIRCLE = 'alert-circle';
exports.ALERT_CIRCLE = ALERT_CIRCLE;
var ALERT_OCTAGON = 'alert-octagon';
exports.ALERT_OCTAGON = ALERT_OCTAGON;
var ALERT_TRIANGLE = 'alert-triangle';
exports.ALERT_TRIANGLE = ALERT_TRIANGLE;
var ALIGN_CENTER = 'align-center';
exports.ALIGN_CENTER = ALIGN_CENTER;
var ALIGN_JUSTIFY = 'align-justify';
exports.ALIGN_JUSTIFY = ALIGN_JUSTIFY;
var ALIGN_LEFT = 'align-left';
exports.ALIGN_LEFT = ALIGN_LEFT;
var ALIGN_RIGHT = 'align-right';
exports.ALIGN_RIGHT = ALIGN_RIGHT;
var ANCHOR = 'anchor';
exports.ANCHOR = ANCHOR;
var APERTURE = 'aperture';
exports.APERTURE = APERTURE;
var ARCHIVE = 'archive';
exports.ARCHIVE = ARCHIVE;
var ARROW_DOWN_CIRCLE = 'arrow-down-circle';
exports.ARROW_DOWN_CIRCLE = ARROW_DOWN_CIRCLE;
var ARROW_DOWN_LEFT = 'arrow-down-left';
exports.ARROW_DOWN_LEFT = ARROW_DOWN_LEFT;
var ARROW_DOWN_RIGHT = 'arrow-down-right';
exports.ARROW_DOWN_RIGHT = ARROW_DOWN_RIGHT;
var ARROW_DOWN = 'arrow-down';
exports.ARROW_DOWN = ARROW_DOWN;
var ARROW_LEFT_CIRCLE = 'arrow-left-circle';
exports.ARROW_LEFT_CIRCLE = ARROW_LEFT_CIRCLE;
var ARROW_LEFT = 'arrow-left';
exports.ARROW_LEFT = ARROW_LEFT;
var ARROW_RIGHT_CIRCLE = 'arrow-right-circle';
exports.ARROW_RIGHT_CIRCLE = ARROW_RIGHT_CIRCLE;
var ARROW_RIGHT = 'arrow-right';
exports.ARROW_RIGHT = ARROW_RIGHT;
var ARROW_UP_CIRCLE = 'arrow-up-circle';
exports.ARROW_UP_CIRCLE = ARROW_UP_CIRCLE;
var ARROW_UP_LEFT = 'arrow-up-left';
exports.ARROW_UP_LEFT = ARROW_UP_LEFT;
var ARROW_UP_RIGHT = 'arrow-up-right';
exports.ARROW_UP_RIGHT = ARROW_UP_RIGHT;
var ARROW_UP = 'arrow-up';
exports.ARROW_UP = ARROW_UP;
var AT_SIGN = 'at-sign';
exports.AT_SIGN = AT_SIGN;
var AWARD = 'award';
exports.AWARD = AWARD;
var BAR_CHART_2 = 'bar-chart-2';
exports.BAR_CHART_2 = BAR_CHART_2;
var BAR_CHART = 'bar-chart';
exports.BAR_CHART = BAR_CHART;
var BATTERY_CHARGING = 'battery-charging';
exports.BATTERY_CHARGING = BATTERY_CHARGING;
var BATTERY = 'battery';
exports.BATTERY = BATTERY;
var BELL_OFF = 'bell-off';
exports.BELL_OFF = BELL_OFF;
var BELL = 'bell';
exports.BELL = BELL;
var BLUETOOTH = 'bluetooth';
exports.BLUETOOTH = BLUETOOTH;
var BOLD = 'bold';
exports.BOLD = BOLD;
var BOOK_OPEN = 'book-open';
exports.BOOK_OPEN = BOOK_OPEN;
var BOOK = 'book';
exports.BOOK = BOOK;
var BOOKMARK = 'bookmark';
exports.BOOKMARK = BOOKMARK;
var BOX = 'box';
exports.BOX = BOX;
var BRIEFCASE = 'briefcase';
exports.BRIEFCASE = BRIEFCASE;
var CALENDAR = 'calendar';
exports.CALENDAR = CALENDAR;
var CAMERA_OFF = 'camera-off';
exports.CAMERA_OFF = CAMERA_OFF;
var CAMERA = 'camera';
exports.CAMERA = CAMERA;
var CAST = 'cast';
exports.CAST = CAST;
var CHECK_CIRCLE = 'check-circle';
exports.CHECK_CIRCLE = CHECK_CIRCLE;
var CHECK_SQUARE = 'check-square';
exports.CHECK_SQUARE = CHECK_SQUARE;
var CHECK = 'check';
exports.CHECK = CHECK;
var CHEVRON_DOWN = 'chevron-down';
exports.CHEVRON_DOWN = CHEVRON_DOWN;
var CHEVRON_LEFT = 'chevron-left';
exports.CHEVRON_LEFT = CHEVRON_LEFT;
var CHEVRON_RIGHT = 'chevron-right';
exports.CHEVRON_RIGHT = CHEVRON_RIGHT;
var CHEVRON_UP = 'chevron-up';
exports.CHEVRON_UP = CHEVRON_UP;
var CHEVRONS_DOWN = 'chevrons-down';
exports.CHEVRONS_DOWN = CHEVRONS_DOWN;
var CHEVRONS_LEFT = 'chevrons-left';
exports.CHEVRONS_LEFT = CHEVRONS_LEFT;
var CHEVRONS_RIGHT = 'chevrons-right';
exports.CHEVRONS_RIGHT = CHEVRONS_RIGHT;
var CHEVRONS_UP = 'chevrons-up';
exports.CHEVRONS_UP = CHEVRONS_UP;
var CHROME = 'chrome';
exports.CHROME = CHROME;
var CIRCLE = 'circle';
exports.CIRCLE = CIRCLE;
var CLIPBOARD = 'clipboard';
exports.CLIPBOARD = CLIPBOARD;
var CLOCK = 'clock';
exports.CLOCK = CLOCK;
var CLOUD_DRIZZLE = 'cloud-drizzle';
exports.CLOUD_DRIZZLE = CLOUD_DRIZZLE;
var CLOUD_LIGHTNING = 'cloud-lightning';
exports.CLOUD_LIGHTNING = CLOUD_LIGHTNING;
var CLOUD_OFF = 'cloud-off';
exports.CLOUD_OFF = CLOUD_OFF;
var CLOUD_RAIN = 'cloud-rain';
exports.CLOUD_RAIN = CLOUD_RAIN;
var CLOUD_SNOW = 'cloud-snow';
exports.CLOUD_SNOW = CLOUD_SNOW;
var CLOUD = 'cloud';
exports.CLOUD = CLOUD;
var CODE = 'code';
exports.CODE = CODE;
var CODEPEN = 'codepen';
exports.CODEPEN = CODEPEN;
var CODESANDBOX = 'codesandbox';
exports.CODESANDBOX = CODESANDBOX;
var COFFEE = 'coffee';
exports.COFFEE = COFFEE;
var COLUMNS = 'columns';
exports.COLUMNS = COLUMNS;
var COMMAND = 'command';
exports.COMMAND = COMMAND;
var COMPASS = 'compass';
exports.COMPASS = COMPASS;
var COPY = 'copy';
exports.COPY = COPY;
var CORNER_DOWN_LEFT = 'corner-down-left';
exports.CORNER_DOWN_LEFT = CORNER_DOWN_LEFT;
var CORNER_DOWN_RIGHT = 'corner-down-right';
exports.CORNER_DOWN_RIGHT = CORNER_DOWN_RIGHT;
var CORNER_LEFT_DOWN = 'corner-left-down';
exports.CORNER_LEFT_DOWN = CORNER_LEFT_DOWN;
var CORNER_LEFT_UP = 'corner-left-up';
exports.CORNER_LEFT_UP = CORNER_LEFT_UP;
var CORNER_RIGHT_DOWN = 'corner-right-down';
exports.CORNER_RIGHT_DOWN = CORNER_RIGHT_DOWN;
var CORNER_RIGHT_UP = 'corner-right-up';
exports.CORNER_RIGHT_UP = CORNER_RIGHT_UP;
var CORNER_UP_LEFT = 'corner-up-left';
exports.CORNER_UP_LEFT = CORNER_UP_LEFT;
var CORNER_UP_RIGHT = 'corner-up-right';
exports.CORNER_UP_RIGHT = CORNER_UP_RIGHT;
var CPU = 'cpu';
exports.CPU = CPU;
var CREDIT_CARD = 'credit-card';
exports.CREDIT_CARD = CREDIT_CARD;
var CROP = 'crop';
exports.CROP = CROP;
var CROSSHAIR = 'crosshair';
exports.CROSSHAIR = CROSSHAIR;
var DATABASE = 'database';
exports.DATABASE = DATABASE;
var DELETE = 'delete';
exports.DELETE = DELETE;
var DISC = 'disc';
exports.DISC = DISC;
var DIVIDE_CIRCLE = 'divide-circle';
exports.DIVIDE_CIRCLE = DIVIDE_CIRCLE;
var DIVIDE_SQUARE = 'divide-square';
exports.DIVIDE_SQUARE = DIVIDE_SQUARE;
var DIVIDE = 'divide';
exports.DIVIDE = DIVIDE;
var DOLLAR_SIGN = 'dollar-sign';
exports.DOLLAR_SIGN = DOLLAR_SIGN;
var DOWNLOAD_CLOUD = 'download-cloud';
exports.DOWNLOAD_CLOUD = DOWNLOAD_CLOUD;
var DOWNLOAD = 'download';
exports.DOWNLOAD = DOWNLOAD;
var DRIBBBLE = 'dribbble';
exports.DRIBBBLE = DRIBBBLE;
var DROPLET = 'droplet';
exports.DROPLET = DROPLET;
var EDIT_2 = 'edit-2';
exports.EDIT_2 = EDIT_2;
var EDIT_3 = 'edit-3';
exports.EDIT_3 = EDIT_3;
var EDIT = 'edit';
exports.EDIT = EDIT;
var EXTERNAL_LINK = 'external-link';
exports.EXTERNAL_LINK = EXTERNAL_LINK;
var EYE_OFF = 'eye-off';
exports.EYE_OFF = EYE_OFF;
var EYE = 'eye';
exports.EYE = EYE;
var FACEBOOK = 'facebook';
exports.FACEBOOK = FACEBOOK;
var FAST_FORWARD = 'fast-forward';
exports.FAST_FORWARD = FAST_FORWARD;
var FEATHER = 'feather';
exports.FEATHER = FEATHER;
var FIGMA = 'figma';
exports.FIGMA = FIGMA;
var FILE_MINUS = 'file-minus';
exports.FILE_MINUS = FILE_MINUS;
var FILE_PLUS = 'file-plus';
exports.FILE_PLUS = FILE_PLUS;
var FILE_TEXT = 'file-text';
exports.FILE_TEXT = FILE_TEXT;
var FILE = 'file';
exports.FILE = FILE;
var FILM = 'film';
exports.FILM = FILM;
var FILTER = 'filter';
exports.FILTER = FILTER;
var FLAG = 'flag';
exports.FLAG = FLAG;
var FOLDER_MINUS = 'folder-minus';
exports.FOLDER_MINUS = FOLDER_MINUS;
var FOLDER_PLUS = 'folder-plus';
exports.FOLDER_PLUS = FOLDER_PLUS;
var FOLDER = 'folder';
exports.FOLDER = FOLDER;
var FRAMER = 'framer';
exports.FRAMER = FRAMER;
var FROWN = 'frown';
exports.FROWN = FROWN;
var GIFT = 'gift';
exports.GIFT = GIFT;
var GIT_BRANCH = 'git-branch';
exports.GIT_BRANCH = GIT_BRANCH;
var GIT_COMMIT = 'git-commit';
exports.GIT_COMMIT = GIT_COMMIT;
var GIT_MERGE = 'git-merge';
exports.GIT_MERGE = GIT_MERGE;
var GIT_PULL_REQUEST = 'git-pull-request';
exports.GIT_PULL_REQUEST = GIT_PULL_REQUEST;
var GITHUB = 'github';
exports.GITHUB = GITHUB;
var GITLAB = 'gitlab';
exports.GITLAB = GITLAB;
var GLOBE = 'globe';
exports.GLOBE = GLOBE;
var GRID = 'grid';
exports.GRID = GRID;
var HARD_DRIVE = 'hard-drive';
exports.HARD_DRIVE = HARD_DRIVE;
var HASH = 'hash';
exports.HASH = HASH;
var HEADPHONES = 'headphones';
exports.HEADPHONES = HEADPHONES;
var HEART = 'heart';
exports.HEART = HEART;
var HELP_CIRCLE = 'help-circle';
exports.HELP_CIRCLE = HELP_CIRCLE;
var HEXAGON = 'hexagon';
exports.HEXAGON = HEXAGON;
var HOME = 'home';
exports.HOME = HOME;
var IMAGE = 'image';
exports.IMAGE = IMAGE;
var INBOX = 'inbox';
exports.INBOX = INBOX;
var INFO = 'info';
exports.INFO = INFO;
var INSTAGRAM = 'instagram';
exports.INSTAGRAM = INSTAGRAM;
var ITALIC = 'italic';
exports.ITALIC = ITALIC;
var KEY = 'key';
exports.KEY = KEY;
var LAYERS = 'layers';
exports.LAYERS = LAYERS;
var LAYOUT = 'layout';
exports.LAYOUT = LAYOUT;
var LIFE_BUOY = 'life-buoy';
exports.LIFE_BUOY = LIFE_BUOY;
var LINK_2 = 'link-2';
exports.LINK_2 = LINK_2;
var LINK = 'link';
exports.LINK = LINK;
var LINKEDIN = 'linkedin';
exports.LINKEDIN = LINKEDIN;
var LIST = 'list';
exports.LIST = LIST;
var LOADER = 'loader';
exports.LOADER = LOADER;
var LOCK = 'lock';
exports.LOCK = LOCK;
var LOG_IN = 'log-in';
exports.LOG_IN = LOG_IN;
var LOG_OUT = 'log-out';
exports.LOG_OUT = LOG_OUT;
var MAIL = 'mail';
exports.MAIL = MAIL;
var MAP_PIN = 'map-pin';
exports.MAP_PIN = MAP_PIN;
var MAP = 'map';
exports.MAP = MAP;
var MAXIMIZE_2 = 'maximize-2';
exports.MAXIMIZE_2 = MAXIMIZE_2;
var MAXIMIZE = 'maximize';
exports.MAXIMIZE = MAXIMIZE;
var MEH = 'meh';
exports.MEH = MEH;
var MENU = 'menu';
exports.MENU = MENU;
var MESSAGE_CIRCLE = 'message-circle';
exports.MESSAGE_CIRCLE = MESSAGE_CIRCLE;
var MESSAGE_SQUARE = 'message-square';
exports.MESSAGE_SQUARE = MESSAGE_SQUARE;
var MIC_OFF = 'mic-off';
exports.MIC_OFF = MIC_OFF;
var MIC = 'mic';
exports.MIC = MIC;
var MINIMIZE_2 = 'minimize-2';
exports.MINIMIZE_2 = MINIMIZE_2;
var MINIMIZE = 'minimize';
exports.MINIMIZE = MINIMIZE;
var MINUS_CIRCLE = 'minus-circle';
exports.MINUS_CIRCLE = MINUS_CIRCLE;
var MINUS_SQUARE = 'minus-square';
exports.MINUS_SQUARE = MINUS_SQUARE;
var MINUS = 'minus';
exports.MINUS = MINUS;
var MONITOR = 'monitor';
exports.MONITOR = MONITOR;
var MOON = 'moon';
exports.MOON = MOON;
var MORE_HORIZONTAL = 'more-horizontal';
exports.MORE_HORIZONTAL = MORE_HORIZONTAL;
var MORE_VERTICAL = 'more-vertical';
exports.MORE_VERTICAL = MORE_VERTICAL;
var MOUSE_POINTER = 'mouse-pointer';
exports.MOUSE_POINTER = MOUSE_POINTER;
var MOVE = 'move';
exports.MOVE = MOVE;
var MUSIC = 'music';
exports.MUSIC = MUSIC;
var NAVIGATION_2 = 'navigation-2';
exports.NAVIGATION_2 = NAVIGATION_2;
var NAVIGATION = 'navigation';
exports.NAVIGATION = NAVIGATION;
var OCTAGON = 'octagon';
exports.OCTAGON = OCTAGON;
var PACKAGE = 'package';
exports.PACKAGE = PACKAGE;
var PAPERCLIP = 'paperclip';
exports.PAPERCLIP = PAPERCLIP;
var PAUSE_CIRCLE = 'pause-circle';
exports.PAUSE_CIRCLE = PAUSE_CIRCLE;
var PAUSE = 'pause';
exports.PAUSE = PAUSE;
var PEN_TOOL = 'pen-tool';
exports.PEN_TOOL = PEN_TOOL;
var PERCENT = 'percent';
exports.PERCENT = PERCENT;
var PHONE_CALL = 'phone-call';
exports.PHONE_CALL = PHONE_CALL;
var PHONE_FORWARDED = 'phone-forwarded';
exports.PHONE_FORWARDED = PHONE_FORWARDED;
var PHONE_INCOMING = 'phone-incoming';
exports.PHONE_INCOMING = PHONE_INCOMING;
var PHONE_MISSED = 'phone-missed';
exports.PHONE_MISSED = PHONE_MISSED;
var PHONE_OFF = 'phone-off';
exports.PHONE_OFF = PHONE_OFF;
var PHONE_OUTGOING = 'phone-outgoing';
exports.PHONE_OUTGOING = PHONE_OUTGOING;
var PHONE = 'phone';
exports.PHONE = PHONE;
var PIE_CHART = 'pie-chart';
exports.PIE_CHART = PIE_CHART;
var PLAY_CIRCLE = 'play-circle';
exports.PLAY_CIRCLE = PLAY_CIRCLE;
var PLAY = 'play';
exports.PLAY = PLAY;
var PLUS_CIRCLE = 'plus-circle';
exports.PLUS_CIRCLE = PLUS_CIRCLE;
var PLUS_SQUARE = 'plus-square';
exports.PLUS_SQUARE = PLUS_SQUARE;
var PLUS = 'plus';
exports.PLUS = PLUS;
var POCKET = 'pocket';
exports.POCKET = POCKET;
var POWER = 'power';
exports.POWER = POWER;
var PRINTER = 'printer';
exports.PRINTER = PRINTER;
var RADIO = 'radio';
exports.RADIO = RADIO;
var REFRESH_CCW = 'refresh-ccw';
exports.REFRESH_CCW = REFRESH_CCW;
var REFRESH_CW = 'refresh-cw';
exports.REFRESH_CW = REFRESH_CW;
var REPEAT = 'repeat';
exports.REPEAT = REPEAT;
var REWIND = 'rewind';
exports.REWIND = REWIND;
var ROTATE_CCW = 'rotate-ccw';
exports.ROTATE_CCW = ROTATE_CCW;
var ROTATE_CW = 'rotate-cw';
exports.ROTATE_CW = ROTATE_CW;
var RSS = 'rss';
exports.RSS = RSS;
var SAVE = 'save';
exports.SAVE = SAVE;
var SCISSORS = 'scissors';
exports.SCISSORS = SCISSORS;
var SEARCH = 'search';
exports.SEARCH = SEARCH;
var SEND = 'send';
exports.SEND = SEND;
var SERVER = 'server';
exports.SERVER = SERVER;
var SETTINGS = 'settings';
exports.SETTINGS = SETTINGS;
var SHARE_2 = 'share-2';
exports.SHARE_2 = SHARE_2;
var SHARE = 'share';
exports.SHARE = SHARE;
var SHIELD_OFF = 'shield-off';
exports.SHIELD_OFF = SHIELD_OFF;
var SHIELD = 'shield';
exports.SHIELD = SHIELD;
var SHOPPING_BAG = 'shopping-bag';
exports.SHOPPING_BAG = SHOPPING_BAG;
var SHOPPING_CART = 'shopping-cart';
exports.SHOPPING_CART = SHOPPING_CART;
var SHUFFLE = 'shuffle';
exports.SHUFFLE = SHUFFLE;
var SIDEBAR = 'sidebar';
exports.SIDEBAR = SIDEBAR;
var SKIP_BACK = 'skip-back';
exports.SKIP_BACK = SKIP_BACK;
var SKIP_FORWARD = 'skip-forward';
exports.SKIP_FORWARD = SKIP_FORWARD;
var SLACK = 'slack';
exports.SLACK = SLACK;
var SLASH = 'slash';
exports.SLASH = SLASH;
var SLIDERS = 'sliders';
exports.SLIDERS = SLIDERS;
var SMARTPHONE = 'smartphone';
exports.SMARTPHONE = SMARTPHONE;
var SMILE = 'smile';
exports.SMILE = SMILE;
var SPEAKER = 'speaker';
exports.SPEAKER = SPEAKER;
var SQUARE = 'square';
exports.SQUARE = SQUARE;
var STAR = 'star';
exports.STAR = STAR;
var STOP_CIRCLE = 'stop-circle';
exports.STOP_CIRCLE = STOP_CIRCLE;
var SUN = 'sun';
exports.SUN = SUN;
var SUNRISE = 'sunrise';
exports.SUNRISE = SUNRISE;
var SUNSET = 'sunset';
exports.SUNSET = SUNSET;
var TABLET = 'tablet';
exports.TABLET = TABLET;
var TAG = 'tag';
exports.TAG = TAG;
var TARGET = 'target';
exports.TARGET = TARGET;
var TERMINAL = 'terminal';
exports.TERMINAL = TERMINAL;
var THERMOMETER = 'thermometer';
exports.THERMOMETER = THERMOMETER;
var THUMBS_DOWN = 'thumbs-down';
exports.THUMBS_DOWN = THUMBS_DOWN;
var THUMBS_UP = 'thumbs-up';
exports.THUMBS_UP = THUMBS_UP;
var TOGGLE_LEFT = 'toggle-left';
exports.TOGGLE_LEFT = TOGGLE_LEFT;
var TOGGLE_RIGHT = 'toggle-right';
exports.TOGGLE_RIGHT = TOGGLE_RIGHT;
var TOOL = 'tool';
exports.TOOL = TOOL;
var TRASH_2 = 'trash-2';
exports.TRASH_2 = TRASH_2;
var TRASH = 'trash';
exports.TRASH = TRASH;
var TRELLO = 'trello';
exports.TRELLO = TRELLO;
var TRENDING_DOWN = 'trending-down';
exports.TRENDING_DOWN = TRENDING_DOWN;
var TRENDING_UP = 'trending-up';
exports.TRENDING_UP = TRENDING_UP;
var TRIANGLE = 'triangle';
exports.TRIANGLE = TRIANGLE;
var TRUCK = 'truck';
exports.TRUCK = TRUCK;
var TV = 'tv';
exports.TV = TV;
var TWITCH = 'twitch';
exports.TWITCH = TWITCH;
var TWITTER = 'twitter';
exports.TWITTER = TWITTER;
var TYPE = 'type';
exports.TYPE = TYPE;
var UMBRELLA = 'umbrella';
exports.UMBRELLA = UMBRELLA;
var UNDERLINE = 'underline';
exports.UNDERLINE = UNDERLINE;
var UNLOCK = 'unlock';
exports.UNLOCK = UNLOCK;
var UPLOAD_CLOUD = 'upload-cloud';
exports.UPLOAD_CLOUD = UPLOAD_CLOUD;
var UPLOAD = 'upload';
exports.UPLOAD = UPLOAD;
var USER_CHECK = 'user-check';
exports.USER_CHECK = USER_CHECK;
var USER_MINUS = 'user-minus';
exports.USER_MINUS = USER_MINUS;
var USER_PLUS = 'user-plus';
exports.USER_PLUS = USER_PLUS;
var USER_X = 'user-x';
exports.USER_X = USER_X;
var USER = 'user';
exports.USER = USER;
var USERS = 'users';
exports.USERS = USERS;
var VIDEO_OFF = 'video-off';
exports.VIDEO_OFF = VIDEO_OFF;
var VIDEO = 'video';
exports.VIDEO = VIDEO;
var VOICEMAIL = 'voicemail';
exports.VOICEMAIL = VOICEMAIL;
var VOLUME_1 = 'volume-1';
exports.VOLUME_1 = VOLUME_1;
var VOLUME_2 = 'volume-2';
exports.VOLUME_2 = VOLUME_2;
var VOLUME_X = 'volume-x';
exports.VOLUME_X = VOLUME_X;
var VOLUME = 'volume';
exports.VOLUME = VOLUME;
var WATCH = 'watch';
exports.WATCH = WATCH;
var WIFI_OFF = 'wifi-off';
exports.WIFI_OFF = WIFI_OFF;
var WIFI = 'wifi';
exports.WIFI = WIFI;
var WIND = 'wind';
exports.WIND = WIND;
var X_CIRCLE = 'x-circle';
exports.X_CIRCLE = X_CIRCLE;
var X_OCTAGON = 'x-octagon';
exports.X_OCTAGON = X_OCTAGON;
var X_SQUARE = 'x-square';
exports.X_SQUARE = X_SQUARE;
var X = 'x';
exports.X = X;
var YOUTUBE = 'youtube';
exports.YOUTUBE = YOUTUBE;
var ZAP_OFF = 'zap-off';
exports.ZAP_OFF = ZAP_OFF;
var ZAP = 'zap';
exports.ZAP = ZAP;
var ZOOM_IN = 'zoom-in';
exports.ZOOM_IN = ZOOM_IN;
var ZOOM_OUT = 'zoom-out';
exports.ZOOM_OUT = ZOOM_OUT;
},{}],"../node_modules/construct-ui/lib/esm/components/icon/generated/IconContents.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* tslint:disable */
var _default = {
  'activity': '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
  'airplay': '<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon>',
  'alert-circle': '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
  'alert-octagon': '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
  'alert-triangle': '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
  'align-center': '<line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line>',
  'align-justify': '<line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line>',
  'align-left': '<line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line>',
  'align-right': '<line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line>',
  'anchor': '<circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>',
  'aperture': '<circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>',
  'archive': '<polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line>',
  'arrow-down-circle': '<circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line>',
  'arrow-down-left': '<line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline>',
  'arrow-down-right': '<line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline>',
  'arrow-down': '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>',
  'arrow-left-circle': '<circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line>',
  'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
  'arrow-right-circle': '<circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line>',
  'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
  'arrow-up-circle': '<circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line>',
  'arrow-up-left': '<line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline>',
  'arrow-up-right': '<line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline>',
  'arrow-up': '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>',
  'at-sign': '<circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>',
  'award': '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>',
  'bar-chart-2': '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>',
  'bar-chart': '<line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line>',
  'battery-charging': '<path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline>',
  'battery': '<rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line>',
  'bell-off': '<path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
  'bell': '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
  'bluetooth': '<polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline>',
  'bold': '<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>',
  'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
  'book': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
  'bookmark': '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>',
  'box': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
  'briefcase': '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
  'calendar': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
  'camera-off': '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path>',
  'camera': '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>',
  'cast': '<path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path><line x1="2" y1="20" x2="2.01" y2="20"></line>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
  'check-square': '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
  'check': '<polyline points="20 6 9 17 4 12"></polyline>',
  'chevron-down': '<polyline points="6 9 12 15 18 9"></polyline>',
  'chevron-left': '<polyline points="15 18 9 12 15 6"></polyline>',
  'chevron-right': '<polyline points="9 18 15 12 9 6"></polyline>',
  'chevron-up': '<polyline points="18 15 12 9 6 15"></polyline>',
  'chevrons-down': '<polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline>',
  'chevrons-left': '<polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline>',
  'chevrons-right': '<polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline>',
  'chevrons-up': '<polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline>',
  'chrome': '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>',
  'circle': '<circle cx="12" cy="12" r="10"></circle>',
  'clipboard': '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>',
  'clock': '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  'cloud-drizzle': '<line x1="8" y1="19" x2="8" y2="21"></line><line x1="8" y1="13" x2="8" y2="15"></line><line x1="16" y1="19" x2="16" y2="21"></line><line x1="16" y1="13" x2="16" y2="15"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="12" y1="15" x2="12" y2="17"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>',
  'cloud-lightning': '<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline>',
  'cloud-off': '<path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
  'cloud-rain': '<line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>',
  'cloud-snow': '<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="8" y1="20" x2="8.01" y2="20"></line><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="12" y1="22" x2="12.01" y2="22"></line><line x1="16" y1="16" x2="16.01" y2="16"></line><line x1="16" y1="20" x2="16.01" y2="20"></line>',
  'cloud': '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>',
  'code': '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
  'codepen': '<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line>',
  'codesandbox': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
  'coffee': '<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>',
  'columns': '<path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>',
  'command': '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>',
  'compass': '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>',
  'copy': '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
  'corner-down-left': '<polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path>',
  'corner-down-right': '<polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path>',
  'corner-left-down': '<polyline points="14 15 9 20 4 15"></polyline><path d="M20 4h-7a4 4 0 0 0-4 4v12"></path>',
  'corner-left-up': '<polyline points="14 9 9 4 4 9"></polyline><path d="M20 20h-7a4 4 0 0 1-4-4V4"></path>',
  'corner-right-down': '<polyline points="10 15 15 20 20 15"></polyline><path d="M4 4h7a4 4 0 0 1 4 4v12"></path>',
  'corner-right-up': '<polyline points="10 9 15 4 20 9"></polyline><path d="M4 20h7a4 4 0 0 0 4-4V4"></path>',
  'corner-up-left': '<polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>',
  'corner-up-right': '<polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>',
  'cpu': '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>',
  'credit-card': '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>',
  'crop': '<path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>',
  'crosshair': '<circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line>',
  'database': '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>',
  'delete': '<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line>',
  'disc': '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>',
  'divide-circle': '<line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line><circle cx="12" cy="12" r="10"></circle>',
  'divide-square': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line>',
  'divide': '<circle cx="12" cy="6" r="2"></circle><line x1="5" y1="12" x2="19" y2="12"></line><circle cx="12" cy="18" r="2"></circle>',
  'dollar-sign': '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
  'download-cloud': '<polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>',
  'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',
  'dribbble': '<circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>',
  'droplet': '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>',
  'edit-2': '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>',
  'edit-3': '<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>',
  'edit': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>',
  'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
  'eye-off': '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
  'eye': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>',
  'facebook': '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',
  'fast-forward': '<polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon>',
  'feather': '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line>',
  'figma': '<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path>',
  'file-minus': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line>',
  'file-plus': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
  'file': '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline>',
  'film': '<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line>',
  'filter': '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>',
  'flag': '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>',
  'folder-minus': '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line>',
  'folder-plus': '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line>',
  'folder': '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',
  'framer': '<path d="M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7"></path>',
  'frown': '<circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>',
  'gift': '<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>',
  'git-branch': '<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>',
  'git-commit': '<circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line>',
  'git-merge': '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path>',
  'git-pull-request': '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line>',
  'github': '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',
  'gitlab': '<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>',
  'globe': '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
  'grid': '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
  'hard-drive': '<line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line>',
  'hash': '<line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>',
  'headphones': '<path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>',
  'heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
  'help-circle': '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>',
  'hexagon': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>',
  'home': '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  'image': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>',
  'inbox': '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>',
  'info': '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
  'instagram': '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>',
  'italic': '<line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line>',
  'key': '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>',
  'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',
  'layout': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>',
  'life-buoy': '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>',
  'link-2': '<path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line>',
  'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>',
  'linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>',
  'list': '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>',
  'loader': '<line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>',
  'lock': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
  'log-in': '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',
  'mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
  'map-pin': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>',
  'map': '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>',
  'maximize-2': '<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>',
  'maximize': '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>',
  'meh': '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>',
  'menu': '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>',
  'message-circle': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>',
  'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
  'mic-off': '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>',
  'mic': '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>',
  'minimize-2': '<polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line>',
  'minimize': '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>',
  'minus-circle': '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line>',
  'minus-square': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line>',
  'minus': '<line x1="5" y1="12" x2="19" y2="12"></line>',
  'monitor': '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
  'moon': '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
  'more-horizontal': '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>',
  'more-vertical': '<circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>',
  'mouse-pointer': '<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path>',
  'move': '<polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>',
  'music': '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
  'navigation-2': '<polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>',
  'navigation': '<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>',
  'octagon': '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>',
  'package': '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
  'paperclip': '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>',
  'pause-circle': '<circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line>',
  'pause': '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>',
  'pen-tool': '<path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle>',
  'percent': '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>',
  'phone-call': '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
  'phone-forwarded': '<polyline points="19 1 23 5 19 9"></polyline><line x1="15" y1="5" x2="23" y2="5"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
  'phone-incoming': '<polyline points="16 2 16 8 22 8"></polyline><line x1="23" y1="1" x2="16" y2="8"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
  'phone-missed': '<line x1="23" y1="1" x2="17" y2="7"></line><line x1="17" y1="1" x2="23" y2="7"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
  'phone-off': '<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line>',
  'phone-outgoing': '<polyline points="23 7 23 1 17 1"></polyline><line x1="16" y1="8" x2="23" y2="1"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
  'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
  'pie-chart': '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>',
  'play-circle': '<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>',
  'play': '<polygon points="5 3 19 12 5 21 5 3"></polygon>',
  'plus-circle': '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>',
  'plus-square': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>',
  'plus': '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
  'pocket': '<path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline>',
  'power': '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line>',
  'printer': '<polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>',
  'radio': '<circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>',
  'refresh-ccw': '<polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>',
  'refresh-cw': '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>',
  'repeat': '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>',
  'rewind': '<polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon>',
  'rotate-ccw': '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>',
  'rotate-cw': '<polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>',
  'rss': '<path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle>',
  'save': '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>',
  'scissors': '<circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line>',
  'search': '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
  'send': '<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>',
  'server': '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>',
  'settings': '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
  'share-2': '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>',
  'share': '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line>',
  'shield-off': '<path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"></path><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
  'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
  'shopping-bag': '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>',
  'shopping-cart': '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
  'shuffle': '<polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line>',
  'sidebar': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>',
  'skip-back': '<polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line>',
  'skip-forward': '<polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line>',
  'slack': '<path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path>',
  'slash': '<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>',
  'sliders': '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>',
  'smartphone': '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>',
  'smile': '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>',
  'speaker': '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line>',
  'square': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>',
  'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
  'stop-circle': '<circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect>',
  'sun': '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>',
  'sunrise': '<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline>',
  'sunset': '<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline>',
  'tablet': '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>',
  'tag': '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
  'target': '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
  'terminal': '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>',
  'thermometer': '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>',
  'thumbs-down': '<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>',
  'thumbs-up': '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>',
  'toggle-left': '<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle>',
  'toggle-right': '<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle>',
  'tool': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
  'trash-2': '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>',
  'trash': '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',
  'trello': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect>',
  'trending-down': '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>',
  'trending-up': '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
  'triangle': '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>',
  'truck': '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>',
  'tv': '<rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>',
  'twitch': '<path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path>',
  'twitter': '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>',
  'type': '<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>',
  'umbrella': '<path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>',
  'underline': '<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line>',
  'unlock': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>',
  'upload-cloud': '<polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline>',
  'upload': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>',
  'user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>',
  'user-minus': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line>',
  'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',
  'user-x': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line>',
  'user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
  'users': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  'video-off': '<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
  'video': '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>',
  'voicemail': '<circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="16" x2="18.5" y2="16"></line>',
  'volume-1': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>',
  'volume-2': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>',
  'volume-x': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>',
  'volume': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>',
  'watch': '<circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>',
  'wifi-off': '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
  'wifi': '<path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
  'wind': '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>',
  'x-circle': '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
  'x-octagon': '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
  'x-square': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line>',
  'x': '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
  'youtube': '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>',
  'zap-off': '<polyline points="12.41 6.75 13 2 10.57 4.92"></polyline><polyline points="18.57 12.91 21 10 15.66 10"></polyline><polyline points="8 8 3 14 12 14 11 22 16 16"></polyline><line x1="1" y1="1" x2="23" y2="23"></line>',
  'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
  'zoom-in': '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line>',
  'zoom-out': '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line>'
};
exports.default = _default;
},{}],"../node_modules/construct-ui/lib/esm/components/icon/generated/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "IconContents", {
  enumerable: true,
  get: function () {
    return _IconContents.default;
  }
});
exports.Icons = void 0;

var Icons = _interopRequireWildcard(require("./IconNames"));

exports.Icons = Icons;

var _IconContents = _interopRequireDefault(require("./IconContents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
},{"./IconNames":"../node_modules/construct-ui/lib/esm/components/icon/generated/IconNames.js","./IconContents":"../node_modules/construct-ui/lib/esm/components/icon/generated/IconContents.js"}],"../node_modules/construct-ui/lib/esm/components/icon/Icon.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icon = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _generated = require("./generated");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Icon =
/** @class */
function () {
  function Icon() {}

  Icon.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var className = attrs.class,
        intent = attrs.intent,
        name = attrs.name,
        onclick = attrs.onclick,
        size = attrs.size,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "intent", "name", "onclick", "size"]);
    var classes = (0, _classnames.default)(_shared.Classes.ICON, _shared.Classes.ICON + "-" + name, intent && "cui-" + intent, size && "cui-" + size, onclick && _shared.Classes.ICON_ACTION, className);

    var svg = _mithril.default.trust("<svg viewBox='0 0 24 24'>" + _generated.IconContents[name] + "</svg>");

    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes,
      onclick: onclick
    }), svg);
  };

  return Icon;
}();

exports.Icon = Icon;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","./generated":"../node_modules/construct-ui/lib/esm/components/icon/generated/index.js"}],"../node_modules/construct-ui/lib/esm/components/icon/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Icons: true
};
Object.defineProperty(exports, "Icons", {
  enumerable: true,
  get: function () {
    return _generated.Icons;
  }
});

var _Icon = require("./Icon");

Object.keys(_Icon).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _Icon[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Icon[key];
    }
  });
});

var _generated = require("./generated");
},{"./Icon":"../node_modules/construct-ui/lib/esm/components/icon/Icon.js","./generated":"../node_modules/construct-ui/lib/esm/components/icon/generated/index.js"}],"../node_modules/construct-ui/lib/esm/components/spinner/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Spinner = void 0;

var _tslib = require("tslib");

var _classnames = _interopRequireDefault(require("classnames"));

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Spinner =
/** @class */
function () {
  function Spinner() {}

  Spinner.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var active = attrs.active,
        background = attrs.background,
        className = attrs.class,
        fill = attrs.fill,
        intent = attrs.intent,
        message = attrs.message,
        size = attrs.size,
        otherAttrs = (0, _tslib.__rest)(attrs, ["active", "background", "class", "fill", "intent", "message", "size"]);
    var content = [(0, _mithril.default)("." + _shared.Classes.SPINNER_CONTENT, [(0, _mithril.default)("." + _shared.Classes.SPINNER_ICON), message && (0, _mithril.default)("." + _shared.Classes.SPINNER_MESSAGE, message)])];
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, otherAttrs), {
      class: (0, _classnames.default)(_shared.Classes.SPINNER, active && _shared.Classes.SPINNER_ACTIVE, background && _shared.Classes.SPINNER_BG, fill && _shared.Classes.SPINNER_FILL, intent && "cui-" + attrs.intent, size && "cui-" + attrs.size, className)
    }), content);
  };

  return Spinner;
}();

exports.Spinner = Spinner;
},{"tslib":"../node_modules/tslib/tslib.es6.js","classnames":"../node_modules/classnames/index.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/button/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = void 0;

var _tslib = require("tslib");

var _classnames = _interopRequireDefault(require("classnames"));

var _mithril = _interopRequireDefault(require("mithril"));

var _icon = require("../icon");

var _spinner = require("../spinner");

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button =
/** @class */
function () {
  function Button() {}

  Button.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var _b = attrs.align,
        align = _b === void 0 ? 'center' : _b,
        active = attrs.active,
        basic = attrs.basic,
        compact = attrs.compact,
        className = attrs.class,
        disabled = attrs.disabled,
        fluid = attrs.fluid,
        href = attrs.href,
        iconLeft = attrs.iconLeft,
        iconLeftAttrs = attrs.iconLeftAttrs,
        iconRight = attrs.iconRight,
        iconRightAttrs = attrs.iconRightAttrs,
        intent = attrs.intent,
        loading = attrs.loading,
        label = attrs.label,
        onclick = attrs.onclick,
        outlined = attrs.outlined,
        rounded = attrs.rounded,
        size = attrs.size,
        sublabel = attrs.sublabel,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["align", "active", "basic", "compact", "class", "disabled", "fluid", "href", "iconLeft", "iconLeftAttrs", "iconRight", "iconRightAttrs", "intent", "loading", "label", "onclick", "outlined", "rounded", "size", "sublabel"]);
    var tag = href ? 'a' : 'button';
    var isAnchor = tag === 'a';
    var classes = (0, _classnames.default)(_shared.Classes.BUTTON, align && _shared.Classes.ALIGN + "-" + align, active && _shared.Classes.ACTIVE, compact && _shared.Classes.COMPACT, disabled && _shared.Classes.DISABLED, fluid && _shared.Classes.FLUID, loading && _shared.Classes.LOADING, size && "cui-" + size, intent && "cui-" + intent, rounded && _shared.Classes.ROUNDED, basic && _shared.Classes.BASIC, outlined && _shared.Classes.OUTLINED, (0, _shared.isNullOrEmpty)(label) && (0, _shared.isNullOrEmpty)(sublabel) && (!iconLeft || !iconRight) && _shared.Classes.BUTTON_ICON, className);
    var content = [loading && (0, _mithril.default)(_spinner.Spinner, {
      active: true,
      fill: true
    }), iconLeft && (0, _mithril.default)(_icon.Icon, (0, _tslib.__assign)({
      name: iconLeft
    }, iconLeftAttrs)), !(0, _shared.isNullOrEmpty)(sublabel) && (0, _mithril.default)('span', {
      class: _shared.Classes.BUTTON_SUBLABEL
    }, sublabel), !(0, _shared.isNullOrEmpty)(label) && (0, _mithril.default)('span', {
      class: _shared.Classes.BUTTON_LABEL
    }, label), iconRight && (0, _mithril.default)(_icon.Icon, (0, _tslib.__assign)({
      name: iconRight
    }, iconRightAttrs))];
    return (0, _mithril.default)(tag, (0, _tslib.__assign)((0, _tslib.__assign)({
      type: isAnchor ? undefined : 'button',
      role: isAnchor ? 'button' : undefined
    }, htmlAttrs), {
      class: classes,
      disabled: disabled,
      // Undefined attrs are not removed on redraw. See https://github.com/MithrilJS/mithril.js/pull/1865#issuecomment-382990558'
      href: disabled ? undefined : href,
      onclick: disabled ? undefined : onclick,
      tabIndex: disabled ? undefined : htmlAttrs.tabIndex
    }), content);
  };

  return Button;
}();

exports.Button = Button;
},{"tslib":"../node_modules/tslib/tslib.es6.js","classnames":"../node_modules/classnames/index.js","mithril":"../node_modules/mithril/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js","../spinner":"../node_modules/construct-ui/lib/esm/components/spinner/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/button-group/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonGroup = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ButtonGroup =
/** @class */
function () {
  function ButtonGroup() {}

  ButtonGroup.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var className = attrs.class,
        size = attrs.size,
        fluid = attrs.fluid,
        intent = attrs.intent,
        rounded = attrs.rounded,
        outlined = attrs.outlined,
        basic = attrs.basic,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "size", "fluid", "intent", "rounded", "outlined", "basic"]);
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: (0, _classnames.default)(_shared.Classes.BUTTON_GROUP, rounded && _shared.Classes.ROUNDED, fluid && _shared.Classes.FLUID, basic && _shared.Classes.BASIC, outlined && _shared.Classes.OUTLINED, intent && "cui-" + intent, size && "cui-" + size, className)
    }), children);
  };

  return ButtonGroup;
}();

exports.ButtonGroup = ButtonGroup;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/card/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Card = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Card =
/** @class */
function () {
  function Card() {}

  Card.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var className = attrs.class,
        elevation = attrs.elevation,
        fluid = attrs.fluid,
        interactive = attrs.interactive,
        size = attrs.size,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "elevation", "fluid", "interactive", "size"]);
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: (0, _classnames.default)(_shared.Classes.CARD, elevation && "cui-elevation-" + (elevation || 1), fluid && _shared.Classes.FLUID, interactive && _shared.Classes.CARD_INTERACTIVE, size && "cui-" + size, className)
    }), children);
  };

  return Card;
}();

exports.Card = Card;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/callout/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Callout = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _icon = require("../icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Callout =
/** @class */
function () {
  function Callout() {}

  Callout.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var content = attrs.content,
        header = attrs.header,
        icon = attrs.icon,
        intent = attrs.intent,
        onDismiss = attrs.onDismiss,
        size = attrs.size,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["content", "header", "icon", "intent", "onDismiss", "size"]);
    var innerContent = [onDismiss && (0, _mithril.default)(_icon.Icon, {
      class: _shared.Classes.CALLOUT_DISMISS_ICON,
      name: _icon.Icons.X,
      onclick: onDismiss
    }), icon && (0, _mithril.default)(_icon.Icon, {
      name: icon
    }), header && (0, _mithril.default)("." + _shared.Classes.CALLOUT_HEADER, header), content && (0, _mithril.default)("." + _shared.Classes.CALLOUT_CONTENT, content)];
    var classes = (0, _classnames.default)(_shared.Classes.CALLOUT, icon && _shared.Classes.CALLOUT_ICON, intent && "cui-" + attrs.intent, size && "cui-" + attrs.size, attrs.class);
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes
    }), innerContent);
  };

  return Callout;
}();

exports.Callout = Callout;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js"}],"../node_modules/construct-ui/lib/esm/components/base-control/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseControl = void 0;

var _tslib = require("tslib");

var _classnames = _interopRequireDefault(require("classnames"));

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseControl =
/** @class */
function () {
  function BaseControl() {}

  BaseControl.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var className = attrs.class,
        _b = attrs.containerAttrs,
        containerAttrs = _b === void 0 ? {} : _b,
        intent = attrs.intent,
        label = attrs.label,
        size = attrs.size,
        type = attrs.type,
        typeClass = attrs.typeClass,
        style = attrs.style,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "containerAttrs", "intent", "label", "size", "type", "typeClass", "style"]);
    var classes = (0, _classnames.default)(_shared.Classes.CONTROL, typeClass, htmlAttrs.disabled && _shared.Classes.DISABLED, intent && "cui-" + intent, size && "cui-" + size, className);
    var content = [(0, _mithril.default)('input', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      disabled: htmlAttrs.disabled || htmlAttrs.readonly,
      type: type
    })), (0, _mithril.default)("span." + _shared.Classes.CONTROL_INDICATOR), label];
    return (0, _mithril.default)('label', (0, _tslib.__assign)({
      class: classes,
      style: style
    }, containerAttrs), content);
  };

  return BaseControl;
}();

exports.BaseControl = BaseControl;
},{"tslib":"../node_modules/tslib/tslib.es6.js","classnames":"../node_modules/classnames/index.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/checkbox/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Checkbox = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

var _baseControl = require("../base-control");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Checkbox =
/** @class */
function () {
  function Checkbox() {}

  Checkbox.prototype.oncreate = function (_a) {
    var attrs = _a.attrs,
        dom = _a.dom;
    this.input = dom.querySelector('input');

    if (attrs.defaultIndeterminate != null) {
      this.input.indeterminate = attrs.defaultIndeterminate;
    }

    this.updateIndeterminate(attrs);
  };

  Checkbox.prototype.onupdate = function (_a) {
    var attrs = _a.attrs,
        dom = _a.dom;
    this.input = dom.querySelector('input');
    this.updateIndeterminate(attrs);
  };

  Checkbox.prototype.view = function (_a) {
    var attrs = _a.attrs;
    return (0, _mithril.default)(_baseControl.BaseControl, (0, _tslib.__assign)((0, _tslib.__assign)({}, attrs), {
      type: 'checkbox',
      typeClass: _shared.Classes.CHECKBOX
    }));
  };

  Checkbox.prototype.updateIndeterminate = function (attrs) {
    if (attrs.indeterminate != null) {
      this.input.indeterminate = attrs.indeterminate;
    }
  };

  return Checkbox;
}();

exports.Checkbox = Checkbox;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../base-control":"../node_modules/construct-ui/lib/esm/components/base-control/index.js"}],"../node_modules/mithril-transition-group/lib/utils.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeCall = void 0;
function safeCall(func, attrs) {
    if (typeof (func) === 'function') {
        func(attrs);
    }
}
exports.safeCall = safeCall;

},{}],"../node_modules/mithril-transition-group/lib/Transition.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transition = exports.TransitionState = void 0;
var mithril_1 = __importDefault(require("mithril"));
var utils_1 = require("./utils");
var TIMEOUT_DELAY = 17;
var TransitionState;
(function (TransitionState) {
    TransitionState["UNMOUNTED"] = "unmounted";
    TransitionState["EXITED"] = "exited";
    TransitionState["ENTERING"] = "entering";
    TransitionState["ENTERED"] = "entered";
    TransitionState["EXITING"] = "exiting";
})(TransitionState = exports.TransitionState || (exports.TransitionState = {}));
var Transition = /** @class */ (function () {
    function Transition() {
        var _this = this;
        this.status = TransitionState.UNMOUNTED;
        this.nextStatus = null;
        this.node = null;
        this.timeoutStack = [];
        this.clearTimeouts = function () {
            if (_this.timeoutStack.length) {
                _this.timeoutStack.map(function (timeout) { return clearTimeout(timeout); });
                _this.timeoutStack = [];
            }
        };
    }
    Transition.prototype.oninit = function (_a) {
        var attrs = _a.attrs;
        if (attrs.isVisible) {
            this.status = TransitionState.EXITED;
            this.nextStatus = TransitionState.ENTERING;
        }
    };
    Transition.prototype.oncreate = function (_a) {
        var attrs = _a.attrs, dom = _a.dom;
        this.node = dom;
        this.updateStatus(attrs);
    };
    Transition.prototype.onupdate = function (_a) {
        var attrs = _a.attrs, dom = _a.dom;
        this.node = dom;
        this.updateStatus(attrs);
    };
    Transition.prototype.onbeforeupdate = function (vnode, old) {
        var isVisible = vnode.attrs.isVisible;
        if (isVisible && this.status === TransitionState.UNMOUNTED) {
            this.status = TransitionState.EXITED;
            this.nextStatus = TransitionState.ENTERING;
        }
        else if (isVisible && !old.attrs.isVisible) {
            this.clearTimeouts();
            this.nextStatus = TransitionState.ENTERING;
        }
        else if (!isVisible && old.attrs.isVisible) {
            this.clearTimeouts();
            this.nextStatus = TransitionState.EXITING;
        }
    };
    Transition.prototype.onbeforeremove = function () {
        this.clearTimeouts();
    };
    Transition.prototype.view = function (_a) {
        var attrs = _a.attrs;
        if (this.status === TransitionState.UNMOUNTED) {
            return null;
        }
        if (typeof (attrs.content) === 'function') {
            return attrs.content(this.status);
        }
        return attrs.content;
    };
    Transition.prototype.getTimeouts = function (attrs) {
        var timeout = attrs.timeout;
        // tslint:disable-next-line:one-variable-per-declaration
        var enter, exit;
        exit = enter = timeout;
        if (timeout !== null && typeof timeout !== 'number') {
            enter = timeout.enter;
            exit = timeout.exit;
        }
        return { enter: enter, exit: exit };
    };
    Transition.prototype.updateStatus = function (attrs, mounting) {
        if (mounting === void 0) { mounting = false; }
        if (this.nextStatus === TransitionState.ENTERING) {
            this.performEnter(attrs);
        }
        else if (this.nextStatus === TransitionState.EXITING) {
            this.performExit(attrs);
        }
        else if (this.nextStatus === TransitionState.UNMOUNTED) {
            this.performUnmount();
        }
    };
    Transition.prototype.performEnter = function (attrs) {
        var _this = this;
        var timeouts = this.getTimeouts(attrs);
        utils_1.safeCall(attrs.onEnter, this.node);
        this.setTimeout(function () {
            _this.status = TransitionState.ENTERING;
            _this.nextStatus = TransitionState.ENTERED;
            mithril_1.default.redraw();
            utils_1.safeCall(attrs.onEntering, _this.node);
        }, TIMEOUT_DELAY);
        this.setTimeout(function () {
            _this.status = TransitionState.ENTERED;
            _this.nextStatus = null;
            mithril_1.default.redraw();
            utils_1.safeCall(attrs.onEntered, _this.node);
        }, timeouts.enter + TIMEOUT_DELAY);
    };
    Transition.prototype.performExit = function (attrs) {
        var _this = this;
        var timeouts = this.getTimeouts(attrs);
        utils_1.safeCall(attrs.onExit, this.node);
        this.setTimeout(function () {
            _this.status = TransitionState.EXITING;
            _this.nextStatus = TransitionState.EXITED;
            mithril_1.default.redraw();
            utils_1.safeCall(attrs.onExiting, _this.node);
        }, TIMEOUT_DELAY);
        this.setTimeout(function () {
            _this.status = TransitionState.EXITED;
            _this.nextStatus = TransitionState.UNMOUNTED;
            mithril_1.default.redraw();
            utils_1.safeCall(attrs.onExited, _this.node);
        }, timeouts.exit + TIMEOUT_DELAY);
    };
    Transition.prototype.performUnmount = function () {
        this.status = TransitionState.UNMOUNTED;
        this.nextStatus = null;
        mithril_1.default.redraw();
    };
    Transition.prototype.setTimeout = function (callback, timeout) {
        var handle = window.setTimeout(callback, timeout);
        this.timeoutStack.push(handle);
        return function () { return clearTimeout(handle); };
    };
    return Transition;
}());
exports.Transition = Transition;

},{"mithril":"../node_modules/mithril/index.js","./utils":"../node_modules/mithril-transition-group/lib/utils.js"}],"../node_modules/mithril-transition-group/lib/CSSTransition.js":[function(require,module,exports) {
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSTransition = void 0;
var mithril_1 = __importDefault(require("mithril"));
var Transition_1 = require("./Transition");
var utils_1 = require("./utils");
var CSSTransition = /** @class */ (function () {
    function CSSTransition() {
        var _this = this;
        this.onEnter = function (node, attrs) {
            _this.removeClasses(node, attrs, 'exit');
            node.classList.add(attrs.transitionClass + "-enter");
            utils_1.safeCall(attrs.onEnter, node);
        };
        this.onEntering = function (node, attrs) {
            _this.removeClasses(node, attrs, 'exit');
            node.classList.add(attrs.transitionClass + "-enter-active");
            // tslint:disable-next-line:no-unused-expression
            node.scrollTop;
            utils_1.safeCall(attrs.onEntering, node);
        };
        this.onEntered = function (node, attrs) {
            _this.removeClasses(node, attrs, 'enter');
            utils_1.safeCall(attrs.onEntered, node);
        };
        this.onExit = function (node, attrs) {
            _this.removeClasses(node, attrs, 'enter');
            node.classList.add(attrs.transitionClass + "-exit");
            utils_1.safeCall(attrs.onExit, node);
        };
        this.onExiting = function (node, attrs) {
            _this.removeClasses(node, attrs, 'enter');
            node.classList.add(attrs.transitionClass + "-exit-active");
            // tslint:disable-next-line:no-unused-expression
            node.scrollTop;
            utils_1.safeCall(attrs.onExiting, node);
        };
        this.onExited = function (node, attrs) {
            _this.removeClasses(node, attrs, 'exit');
            utils_1.safeCall(attrs.onExited, node);
        };
    }
    CSSTransition.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        return mithril_1.default(Transition_1.Transition, __assign(__assign({}, attrs), { onEnter: function (node) { return _this.onEnter(node, attrs); }, onEntering: function (node) { return _this.onEntering(node, attrs); }, onEntered: function (node) { return _this.onEntered(node, attrs); }, onExit: function (node) { return _this.onExit(node, attrs); }, onExiting: function (node) { return _this.onExiting(node, attrs); }, onExited: function (node) { return _this.onExited(node, attrs); } }));
    };
    CSSTransition.prototype.removeClasses = function (node, attrs, type) {
        node.classList.remove(attrs.transitionClass + "-" + type);
        node.classList.remove(attrs.transitionClass + "-" + type + "-active");
    };
    return CSSTransition;
}());
exports.CSSTransition = CSSTransition;

},{"mithril":"../node_modules/mithril/index.js","./Transition":"../node_modules/mithril-transition-group/lib/Transition.js","./utils":"../node_modules/mithril-transition-group/lib/utils.js"}],"../node_modules/mithril-transition-group/lib/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSTransition = exports.TransitionState = exports.Transition = void 0;
var Transition_1 = require("./Transition");
Object.defineProperty(exports, "Transition", { enumerable: true, get: function () { return Transition_1.Transition; } });
Object.defineProperty(exports, "TransitionState", { enumerable: true, get: function () { return Transition_1.TransitionState; } });
var CSSTransition_1 = require("./CSSTransition");
Object.defineProperty(exports, "CSSTransition", { enumerable: true, get: function () { return CSSTransition_1.CSSTransition; } });

},{"./Transition":"../node_modules/mithril-transition-group/lib/Transition.js","./CSSTransition":"../node_modules/mithril-transition-group/lib/CSSTransition.js"}],"../node_modules/construct-ui/lib/esm/components/collapse/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collapse = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _mithrilTransitionGroup = require("mithril-transition-group");

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Collapse =
/** @class */
function () {
  function Collapse() {
    var _this = this;

    this.height = 0;
    this.containerStyles = {
      height: 0,
      overflow: 'hidden',
      transition: ''
    };

    this.handleEnter = function (node) {
      var body = node.querySelector("." + _shared.Classes.COLLAPSE_BODY);
      _this.contentEl = body.children[0];
      _this.height = _this.getContentHeight(_this.contentEl);
      body.style.transform = "translateY(" + -_this.height + "px)";
    };

    this.handleExit = function (node) {
      node.style.height = _this.height + "px";
    };
  }

  Collapse.prototype.oninit = function (_a) {
    var attrs = _a.attrs;
    this.duration = attrs.duration || 300;
    this.containerStyles.transition = "height " + this.duration + "ms ease-out";
  };

  Collapse.prototype.onbeforeupdate = function () {
    if (this.contentEl) {
      this.height = this.getContentHeight(this.contentEl);
    }
  };

  Collapse.prototype.view = function (_a) {
    var _this = this;

    var attrs = _a.attrs,
        children = _a.children;
    var classes = (0, _classnames.default)(_shared.Classes.COLLAPSE, attrs.class);
    return (0, _mithril.default)(_mithrilTransitionGroup.Transition, {
      isVisible: attrs.isOpen,
      onEnter: this.handleEnter,
      onExit: this.handleExit,
      content: function (state) {
        var containerTransitionStyles = {
          entering: {
            height: _this.height + 'px'
          },
          entered: {
            height: 'auto',
            transition: 'none'
          },
          exiting: {
            height: '0px'
          }
        };
        var bodyTransitionStyles = {
          entering: {
            transform: 'translateY(0px)',
            transition: "transform " + _this.duration + "ms ease-out"
          },
          exiting: {
            transform: "translateY(" + -_this.height + "px)",
            transition: "transform " + _this.duration + "ms ease-out"
          }
        };
        var body = (0, _mithril.default)('', {
          class: _shared.Classes.COLLAPSE_BODY,
          style: (0, _tslib.__assign)({}, bodyTransitionStyles[state])
        }, children);
        var container = (0, _mithril.default)('', {
          class: classes,
          style: (0, _tslib.__assign)((0, _tslib.__assign)((0, _tslib.__assign)({}, _this.containerStyles), containerTransitionStyles[state]), attrs.style)
        }, body);
        return container;
      },
      timeout: this.duration
    });
  };

  Collapse.prototype.getContentHeight = function (element) {
    if (!element) return 0;
    var styles = window.getComputedStyle(element);
    var margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    return Math.ceil(element.offsetHeight + margin);
  };

  return Collapse;
}();

exports.Collapse = Collapse;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","mithril-transition-group":"../node_modules/mithril-transition-group/lib/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/control-group/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControlGroup = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ControlGroup =
/** @class */
function () {
  function ControlGroup() {}

  ControlGroup.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var className = attrs.class,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class"]);
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: (0, _classnames.default)(_shared.Classes.CONTROL_GROUP, className)
    }), children);
  };

  return ControlGroup;
}();

exports.ControlGroup = ControlGroup;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractComponent = void 0;

var _tslib = require("tslib");

var AbstractComponent =
/** @class */
function () {
  function AbstractComponent() {
    var _this = this;

    this.timeoutStack = [];
    this.attrs = {};

    this.setTimeout = function (callback, timeout) {
      var handle = window.setTimeout(callback, timeout);

      _this.timeoutStack.push(handle);

      return function () {
        return window.clearTimeout(handle);
      };
    };

    this.clearTimeouts = function () {
      if (_this.timeoutStack.length) {
        _this.timeoutStack.map(function (timeout) {
          return clearTimeout(timeout);
        });

        _this.timeoutStack = [];
      }
    };
  }

  AbstractComponent.prototype.oninit = function (vnode) {
    vnode.attrs = vnode.attrs || {};
    this.setAttrs(vnode);
  };

  AbstractComponent.prototype.onbeforeupdate = function (vnode, prev) {
    this.setAttrs(vnode);
    this.prevAttrs = prev.attrs;
  };

  AbstractComponent.prototype.setAttrs = function (vnode) {
    vnode.attrs = this.getAttrs(vnode.attrs);
    this.attrs = vnode.attrs;
  };

  AbstractComponent.prototype.getAttrs = function (attrs) {
    return (0, _tslib.__assign)((0, _tslib.__assign)({}, this.getDefaultAttrs()), attrs);
  };

  return AbstractComponent;
}();

exports.AbstractComponent = AbstractComponent;
},{"tslib":"../node_modules/tslib/tslib.es6.js"}],"../node_modules/popper.js/dist/esm/popper.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.16.1
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

var timeoutDuration = function () {
  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];

  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      return 1;
    }
  }

  return 0;
}();

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }

    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;
/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/

var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;
/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */


function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  } // NOTE: 1 DOM access here


  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}
/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */


function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }

  return element.parentNode || element.host;
}
/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */


function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;

    case '#document':
      return element.body;
  } // Firefox want us to check `-x` and `-y` variations as well


  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}
/**
 * Returns the reference node of the reference object, or the reference object itself.
 * @method
 * @memberof Popper.Utils
 * @param {Element|Object} reference - the reference element (the popper will be relative to this)
 * @returns {Element} parent
 */


function getReferenceNode(reference) {
  return reference && reference.referenceNode ? reference.referenceNode : reference;
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);
/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */

function isIE(version) {
  if (version === 11) {
    return isIE11;
  }

  if (version === 10) {
    return isIE10;
  }

  return isIE11 || isIE10;
}
/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */


function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null; // NOTE: 1 DOM access here

  var offsetParent = element.offsetParent || null; // Skip hidden elements which don't have an offsetParent

  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  } // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...


  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }

  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}
/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */


function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}
/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */


function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  } // Here we make sure to give as "start" the element that comes first in the DOM


  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1; // Get common ancestor container

  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer; // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  } // one of the nodes is inside shadowDOM, find which one


  var element1root = getRoot(element1);

  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}
/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */


function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';
  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}
/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */


function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}
/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */


function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';
  return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);
  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */


function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}
/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */


function getBoundingClientRect(element) {
  var rect = {}; // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11

  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  }; // subtract scrollbar size from sizes

  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.width;
  var height = sizes.height || element.clientHeight || result.height;
  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height; // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons

  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');
    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);
  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth); // In cases where the parent is fixed, we must ignore negative scroll in offset calc

  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }

  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0; // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.

  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop);
    var marginLeft = parseFloat(styles.marginLeft);
    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft; // Attach marginTop and marginLeft because in some circumstances we may need them

    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);
  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;
  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };
  return getClientRect(offset);
}
/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */


function isFixed(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }

  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }

  var parentNode = getParentNode(element);

  if (!parentNode) {
    return false;
  }

  return isFixed(parentNode);
}
/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */


function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }

  var el = element.parentElement;

  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }

  return el || document.documentElement;
}
/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */


function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false; // NOTE: 1 DOM access here

  var boundaries = {
    top: 0,
    left: 0
  };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference)); // Handle viewport case

  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;

    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));

      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition); // In case of HTML, we need a different computation

    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  } // Add paddings


  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;
  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;
  return width * height;
}
/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);
  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };
  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });
  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });
  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;
  var variation = placement.split('-')[1];
  return computedPlacement + (variation ? '-' + variation : '');
}
/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */


function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}
/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */


function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}
/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */


function getOppositePlacement(placement) {
  var hash = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}
/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */


function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0]; // Get popper node sizes

  var popperRect = getOuterSizes(popper); // Add position, width and height to our offsets object

  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  }; // depending by the popper placement we have to compute its offsets slightly differently

  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';
  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;

  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}
/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */


function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  } // use `filter` to obtain the same behavior of `find`


  return arr.filter(check)[0];
}
/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */


function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  } // use `find` + `indexOf` if `findIndex` isn't supported


  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}
/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */


function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));
  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }

    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation

    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);
      data = fn(data, modifier);
    }
  });
  return data;
}
/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */


function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  }; // compute reference element offsets

  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed); // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value

  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding); // store the computed placement inside `originalPlacement`

  data.originalPlacement = data.placement;
  data.positionFixed = this.options.positionFixed; // compute the popper offsets

  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute'; // run the modifiers

  data = runModifiers(this.modifiers, data); // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback

  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}
/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */


function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}
/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */


function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;

    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }

  return null;
}
/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */


function destroy() {
  this.state.isDestroyed = true; // touch DOM only if `applyStyle` modifier is enabled

  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners(); // remove the popper if user explicitly asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it

  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }

  return this;
}
/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */


function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, {
    passive: true
  });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }

  scrollParents.push(target);
}
/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */


function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, {
    passive: true
  }); // Scroll event listener on scroll parents

  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;
  return state;
}
/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */


function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}
/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */


function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound); // Remove scroll event listener on scroll parents

  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  }); // Reset state

  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}
/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */


function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}
/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */


function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}
/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */


function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = ''; // add unit if the value is numeric and is one of the following

    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }

    element.style[prop] = styles[prop] + unit;
  });
}
/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */


function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];

    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */


function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles); // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element

  setAttributes(data.instance.popper, data.attributes); // if arrowElement is defined and arrowStyles has some properties

  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}
/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */


function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed); // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value

  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);
  popper.setAttribute('x-placement', placement); // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations

  setStyles(popper, {
    position: options.positionFixed ? 'fixed' : 'absolute'
  });
  return options;
}
/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */


function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);
  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;
  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;
  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */

function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper; // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;

  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }

  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;
  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent); // Styles

  var styles = {
    position: popper.position
  };
  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);
  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right'; // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed

  var prefixedProperty = getSupportedPropertyName('transform'); // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.

  var left = void 0,
      top = void 0;

  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }

  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }

  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  } // Attributes


  var attributes = {
    'x-placement': data.placement
  }; // Update `data` attributes, styles and arrowStyles

  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);
  return data;
}
/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */


function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });
  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';

    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }

  return isRequired;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function arrow(data, options) {
  var _data$offsets$arrow; // arrow depends on keepTogether in order to work


  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element; // if arrowElement is a string, suppose it's a CSS selector

  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement); // if arrowElement is not found, don't run the modifier

    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var isVertical = ['left', 'right'].indexOf(placement) !== -1;
  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len]; //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //
  // top/left side

  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  } // bottom/right side


  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }

  data.offsets.popper = getClientRect(data.offsets.popper); // compute center of the popper

  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2; // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available

  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide; // prevent arrowElement from being placed not contiguously to its popper

  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);
  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);
  return data;
}
/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */


function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }

  return variation;
}
/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */


var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start']; // Get rid of `auto` `auto-start` and `auto-end`

var validPlacements = placements.slice(3);
/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */

function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */

function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);
  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';
  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;

    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;

    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;

    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);
    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference; // using floor because the reference offsets may contain decimals we are not going to consider here

    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);
    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);
    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom; // flip the variation if required

    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1; // flips variation if reference element overflows boundaries

    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom); // flips variation if popper content overflows boundaries

    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);
    var flippedVariation = flippedVariationByRef || flippedVariationByContent;

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : ''); // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future

      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));
      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }

  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}
/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */


function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2]; // If it's not a number it's an operator, I guess

  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;

    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;

      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;

    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}
/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */


function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0]; // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one

  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1; // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)

  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  }); // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space

  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  } // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.


  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments]; // Convert the values with units to absolute pixels to allow our computations

  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, []) // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  }); // Loop trough the offsets arrays and execute the operations

  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */


function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var basePlacement = placement.split('-')[0];
  var offsets = void 0;

  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper); // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken

  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  } // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself


  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification

  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];
  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';
  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed); // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed

  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;
  options.boundaries = boundaries;
  var order = options.priority;
  var popper = data.offsets.popper;
  var check = {
    primary: function primary(placement) {
      var value = popper[placement];

      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }

      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];

      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }

      return defineProperty({}, mainSide, value);
    }
  };
  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });
  data.offsets.popper = popper;
  return data;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1]; // if shift shiftvariation is specified, run the modifier

  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;
    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';
    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };
    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;
  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;
  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);
  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);
  return data;
}
/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */


var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: offset,

    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: preventOverflow,

    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],

    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,

    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: arrow,

    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: flip,

    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',

    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,

    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport',

    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,

    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,

    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,

    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: computeStyle,

    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,

    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',

    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: applyStyle,

    /** @prop {Function} */
    onLoad: applyStyleOnLoad,

    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};
/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */

var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};
/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */
// Utils
// Methods

var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {Element|referenceObject} reference - The reference element used to position the popper
   * @param {Element} popper - The HTML / XML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    }; // make update() debounced, so that it only runs at most once-per-tick


    this.update = debounce(this.update.bind(this)); // with {} we create a new object with the options inside it

    this.options = _extends({}, Popper.Defaults, options); // init state

    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    }; // get reference and popper elements (allow jQuery wrappers)

    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper; // Deep merge modifiers options

    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    }); // Refactoring modifiers' list (Object => Array)

    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    }) // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    }); // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!

    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    }); // fire the first update to position the popper in the right place

    this.update();
    var eventsEnabled = this.options.eventsEnabled;

    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  } // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }
    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */

    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();
/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;
var _default = Popper;
exports.default = _default;
},{}],"../node_modules/construct-ui/lib/esm/components/portal/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Portal = void 0;

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Portal =
/** @class */
function () {
  function Portal() {}

  Portal.prototype.oncreate = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var rootElement = document.createElement('div');
    var container = attrs.container || document.body;
    container.appendChild(rootElement);
    this.rootElement = rootElement;
    this.setStyles(attrs);
    this.content = {
      view: function () {
        return children;
      }
    };

    _mithril.default.mount(this.rootElement, this.content);

    (0, _shared.safeCall)(attrs.onContentMount, rootElement);
  };

  Portal.prototype.onupdate = function (_a) {
    var attrs = _a.attrs;
    this.setStyles(attrs);
  };

  Portal.prototype.onbeforeupdate = function (_a) {
    var children = _a.children;
    if (!this.content) return false;

    this.content.view = function () {
      return children;
    };
  };

  Portal.prototype.onremove = function (_a) {
    var attrs = _a.attrs;
    var container = attrs.container || document.body;

    if (container.contains(this.rootElement)) {
      _mithril.default.mount(this.rootElement, null);

      container.removeChild(this.rootElement);
    }
  };

  Portal.prototype.view = function () {
    return _mithril.default.fragment({}, '');
  };

  Portal.prototype.setStyles = function (attrs) {
    this.rootElement.className = (0, _classnames.default)(_shared.Classes.PORTAL, attrs.class);
    this.rootElement.style.cssText = '';

    if (attrs.style) {
      Object.assign(this.rootElement.style, (0, _shared.normalizeStyle)(attrs.style));
    }
  };

  return Portal;
}();

exports.Portal = Portal;
},{"mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/utils/focus-manager/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _shared = require("../../_shared");

var FocusManager =
/** @class */
function () {
  function FocusManager() {
    this.handleMouseDown = function () {
      document.body.classList.add(_shared.Classes.FOCUS_DISABLED);
    };

    this.handleKeyDown = function (e) {
      if (e.which === _shared.Keys.TAB) {
        document.body.classList.remove(_shared.Classes.FOCUS_DISABLED);
      }
    };
  }
  /** Focus outline is shown only when tabbing through elements */


  FocusManager.prototype.showFocusOnlyOnTab = function () {
    var body = document.body;
    body.addEventListener('mousedown', this.handleMouseDown);
    body.addEventListener('keydown', this.handleKeyDown);
  };
  /** Focus outline is always shown (mouse click and tab) */


  FocusManager.prototype.alwaysShowFocus = function () {
    var body = document.body;
    body.removeEventListener('mousedown', this.handleMouseDown);
    body.removeEventListener('keydown', this.handleKeyDown);
    body.classList.remove(_shared.Classes.FOCUS_DISABLED);
  };

  return FocusManager;
}();

var _default = new FocusManager();

exports.default = _default;
},{"../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/simplestatemanager/dist/ssm.min.js":[function(require,module,exports) {
var define;
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.ssm=e()}(this,function(){"use strict";function t(t,e){t.forEach(function(t){return t(e)})}var e=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},n=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),i=[],o=function(){},s=function(){function s(t){e(this,s),this.id=t.id||Math.random().toString(36).substr(2,9),this.query=t.query||"all";if(this.options=Object.assign({},{onEnter:[],onLeave:[],onResize:[],onFirstRun:[]},t),"function"==typeof this.options.onEnter&&(this.options.onEnter=[this.options.onEnter]),"function"==typeof this.options.onLeave&&(this.options.onLeave=[this.options.onLeave]),"function"==typeof this.options.onResize&&(this.options.onResize=[this.options.onResize]),"function"==typeof this.options.onFirstRun&&(this.options.onFirstRun=[this.options.onFirstRun]),!1===this.testConfigOptions("once"))return this.valid=!1,!1;this.valid=!0,this.active=!1,this.init()}return n(s,[{key:"init",value:function(){var t=this;this.test=window.matchMedia(this.query),this.test.matches&&this.testConfigOptions("match")&&this.enterState(),this.listener=function(e){var n=!1;e.matches?t.testConfigOptions("match")&&(t.enterState(),n=!0):(t.leaveState(),n=!0),n&&o()},this.test.addListener(this.listener)}},{key:"enterState",value:function(){t(this.options.onFirstRun,this.eventData("firstRun")),t(this.options.onEnter,this.eventData("enter")),this.options.onFirstRun=[],this.active=!0}},{key:"leaveState",value:function(){t(this.options.onLeave,this.eventData("leave")),this.active=!1}},{key:"resizeState",value:function(){this.testConfigOptions("resize")&&t(this.options.onResize,this.eventData("resize"))}},{key:"destroy",value:function(){this.test.removeListener(this.listener)}},{key:"attachCallback",value:function(t,e,n){switch(t){case"enter":this.options.onEnter.push(e);break;case"leave":this.options.onLeave.push(e);break;case"resize":this.options.onResize.push(e)}"enter"===t&&n&&this.active&&e(this.eventData(t))}},{key:"testConfigOptions",value:function(t){var e=this,n=!0;return i.forEach(function(i){void 0!==e.options[i.name]&&i.when===t&&!1===i.test.bind(e)()&&(n=!1)}),n}},{key:"eventData",value:function(t){return{eventType:t,state:this}}}],[{key:"addConfigOption",value:function(t){i.push(t)}},{key:"getConfigOptions",value:function(){return i}},{key:"removeConfigOption",value:function(t){i.forEach(function(e,n){e.name===t&&i.splice(n,1)})}},{key:"setStateChangeMethod",value:function(t){if("function"!=typeof t)throw new Error("Not a function");o=t}}]),s}();return new(function(){function t(){e(this,t),this.states=[],this.resizeTimer=null,this.configOptions=[],window.addEventListener("resize",function(t){var e=this,n=void 0;return function(){for(var i=arguments.length,o=Array(i),s=0;s<i;s++)o[s]=arguments[s];n&&window.cancelAnimationFrame(n),n=window.requestAnimationFrame(function(){n=null,t.apply(e,o)})}}(this.resizeBrowser.bind(this)),!0)}return n(t,[{key:"addState",value:function(t){var e=new s(t);return e.valid&&this.states.push(e),e}},{key:"addStates",value:function(t){var e=this;t.forEach(function(t){return e.addState(t)})}},{key:"getState",value:function(t){return this.states.filter(function(e){return e.id===t})[0]||!1}},{key:"isActive",value:function(t){return(this.getState(t)||{}).active||!1}},{key:"getStates",value:function(t){var e=this;return void 0===t?this.states:t.map(function(t){return e.getState(t)})}},{key:"removeState",value:function(t){var e=this;this.states.forEach(function(n,i){n.id===t&&(n.destroy(),e.states.splice(i,1))})}},{key:"removeStates",value:function(t){var e=this;t.forEach(function(t){return e.removeState(t)})}},{key:"removeAllStates",value:function(){this.states.forEach(function(t){return t.destroy()}),this.states=[]}},{key:"addConfigOption",value:function(t){var e=t.name,n=void 0===e?"":e,i=t.test,o=void 0===i?null:i,a=t.when,r=void 0===a?"resize":a;""!==n&&null!==o&&s.addConfigOption({name:n,test:o,when:r})}},{key:"removeConfigOption",value:function(t){s.removeConfigOption(t)}},{key:"getConfigOptions",value:function(t){var e=s.getConfigOptions();return"string"==typeof t?e.filter(function(e){return e.name===t}):e}},{key:"resizeBrowser",value:function(){var t,e,n;(t=this.states,e="active",n=!0,t.filter(function(t){return t[e]&&t[e]===n})).forEach(function(t){t.resizeState()})}},{key:"stateChange",value:function(t){s.setStateChangeMethod(t)}}]),t}())});


},{}],"../node_modules/construct-ui/lib/esm/utils/responsive-manager/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

var _ssmMin = _interopRequireDefault(require("simplestatemanager/dist/ssm.min.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
var breakpointKeys = Object.keys(_shared.Breakpoints);

var ResponsiveManager =
/** @class */
function () {
  function ResponsiveManager() {}
  /** Binds breakpoints */


  ResponsiveManager.prototype.initialize = function (breakpoints) {
    var _this = this;

    if (breakpoints === void 0) {
      breakpoints = _shared.Breakpoints;
    }

    this.destroy();
    breakpointKeys.map(function (key) {
      return _ssmMin.default.addState({
        id: key,
        query: breakpoints[key],
        onEnter: function () {
          var _a;

          _this.activeBreakpoints = (0, _tslib.__assign)((0, _tslib.__assign)({}, _this.activeBreakpoints), (_a = {}, _a[key] = true, _a));

          _mithril.default.redraw();
        },
        onLeave: function () {
          var _a;

          _this.activeBreakpoints = (0, _tslib.__assign)((0, _tslib.__assign)({}, _this.activeBreakpoints), (_a = {}, _a[key] = false, _a));

          _mithril.default.redraw();
        }
      });
    });
  };
  /** Checks if current breakpoint string is active */


  ResponsiveManager.prototype.is = function (key) {
    return this.activeBreakpoints[key] === true;
  };
  /** Unbinds all breakpoints */


  ResponsiveManager.prototype.destroy = function () {
    _ssmMin.default.removeStates(breakpointKeys);
  };

  return ResponsiveManager;
}();

var _default = new ResponsiveManager();

exports.default = _default;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","simplestatemanager/dist/ssm.min.js":"../node_modules/simplestatemanager/dist/ssm.min.js"}],"../node_modules/construct-ui/lib/esm/utils/transition-manager/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var TransitionManager =
/** @class */
function () {
  function TransitionManager() {
    /** Whether transitions are active */
    this.isEnabled = true;
  }
  /** Enable all transitions */


  TransitionManager.prototype.enable = function () {
    this.isEnabled = true;
  };
  /** Disable all transitions */


  TransitionManager.prototype.disable = function () {
    return this.isEnabled = false;
  };

  return TransitionManager;
}();

var _default = new TransitionManager();

exports.default = _default;
},{}],"../node_modules/construct-ui/lib/esm/utils/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "FocusManager", {
  enumerable: true,
  get: function () {
    return _focusManager.default;
  }
});
Object.defineProperty(exports, "ResponsiveManager", {
  enumerable: true,
  get: function () {
    return _responsiveManager.default;
  }
});
Object.defineProperty(exports, "TransitionManager", {
  enumerable: true,
  get: function () {
    return _transitionManager.default;
  }
});

var _focusManager = _interopRequireDefault(require("./focus-manager"));

var _responsiveManager = _interopRequireDefault(require("./responsive-manager"));

var _transitionManager = _interopRequireDefault(require("./transition-manager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./focus-manager":"../node_modules/construct-ui/lib/esm/utils/focus-manager/index.js","./responsive-manager":"../node_modules/construct-ui/lib/esm/utils/responsive-manager/index.js","./transition-manager":"../node_modules/construct-ui/lib/esm/utils/transition-manager/index.js"}],"../node_modules/construct-ui/lib/esm/components/overlay/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Overlay = void 0;

var _tslib = require("tslib");

var _classnames = _interopRequireDefault(require("classnames"));

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

var _abstractComponent = require("../abstract-component");

var _portal = require("../portal");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instanceCounter = 0;

var Overlay =
/** @class */
function (_super) {
  (0, _tslib.__extends)(Overlay, _super);

  function Overlay() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.id = instanceCounter++;
    _this.shouldRender = false;

    _this.onContainerCreate = function (_a) {
      var dom = _a.dom;

      if (_this.shouldRender) {
        _this.handleOpen(dom);
      }
    };

    _this.onContainerUpdate = function (_a) {
      var dom = _a.dom;
      var isOpen = _this.attrs.isOpen;
      var wasOpen = _this.prevAttrs.isOpen;

      if (isOpen && !wasOpen) {
        _this.handleOpen(dom);
      } else if (!isOpen && wasOpen) {
        _this.handleClose();
      }
    };

    _this.handleBackdropMouseDown = function (e) {
      var _a = _this.attrs,
          closeOnOutsideClick = _a.closeOnOutsideClick,
          onClose = _a.onClose;

      if (closeOnOutsideClick) {
        (0, _shared.safeCall)(onClose, e);
      } else e.redraw = false;
    };

    _this.handleDocumentMouseDown = function (e) {
      var _a = _this.attrs,
          isOpen = _a.isOpen,
          onClose = _a.onClose,
          closeOnOutsideClick = _a.closeOnOutsideClick;
      var contentEl = _this.contentEl;
      var isClickOnOverlay = contentEl && contentEl.contains(e.target);

      if (isOpen && closeOnOutsideClick && !isClickOnOverlay && _this.lastOpened) {
        (0, _shared.safeCall)(onClose, e);

        _mithril.default.redraw();
      }
    };

    _this.handleKeyDown = function (e) {
      var _a = _this.attrs,
          closeOnEscapeKey = _a.closeOnEscapeKey,
          onClose = _a.onClose;

      if (e.which === _shared.Keys.ESCAPE && closeOnEscapeKey && _this.lastOpened) {
        (0, _shared.safeCall)(onClose, e);
        e.preventDefault();

        _mithril.default.redraw();
      }
    };

    return _this;
  }

  Overlay.prototype.getDefaultAttrs = function () {
    return {
      closeOnEscapeKey: true,
      closeOnOutsideClick: true,
      hasBackdrop: true,
      addToStack: true,
      transitionName: 'fade',
      transitionDuration: _utils.TransitionManager.isEnabled ? 200 : 0
    };
  };

  Overlay.prototype.oninit = function (vnode) {
    _super.prototype.oninit.call(this, vnode);

    this.shouldRender = !!vnode.attrs.isOpen;
  };

  Overlay.prototype.onbeforeupdate = function (vnode, old) {
    var _this = this;

    _super.prototype.onbeforeupdate.call(this, vnode, old);

    var _a = vnode.attrs,
        isOpen = _a.isOpen,
        transitionDuration = _a.transitionDuration;
    var wasOpen = old.attrs.isOpen;

    if (isOpen && !wasOpen) {
      this.clearTimeouts();
      this.shouldRender = true;
    } else if (!isOpen && wasOpen) {
      if (transitionDuration > 0) {
        this.handleClose();
        this.setTimeout(function () {
          _this.shouldRender = false;

          _mithril.default.redraw();

          _this.handleClosed();
        }, transitionDuration);
      } else {
        this.shouldRender = false;
        this.handleClose();
        this.handleClosed();
      }
    }
  };

  Overlay.prototype.onremove = function () {
    if (this.shouldRender === true) {
      this.handleClose();
      this.handleClosed();
      this.shouldRender = false;
    }
  };

  Overlay.prototype.view = function () {
    var _a = this.attrs,
        backdropClass = _a.backdropClass,
        hasBackdrop = _a.hasBackdrop,
        content = _a.content,
        inline = _a.inline,
        className = _a.class,
        style = _a.style,
        portalAttrs = _a.portalAttrs;

    if (!this.shouldRender) {
      return null;
    }

    var innerContent = [hasBackdrop && (0, _mithril.default)('', {
      class: (0, _classnames.default)(_shared.Classes.OVERLAY_BACKDROP, backdropClass),
      onmousedown: this.handleBackdropMouseDown,
      tabindex: 0
    }), content];
    var classes = (0, _classnames.default)(_shared.Classes.OVERLAY, inline && _shared.Classes.OVERLAY_INLINE, className);
    var container = (0, _mithril.default)('', {
      class: classes,
      style: style,
      oncreate: this.onContainerCreate,
      onupdate: this.onContainerUpdate
    }, innerContent);
    return inline ? container : (0, _mithril.default)(_portal.Portal, (0, _tslib.__assign)({}, portalAttrs), container);
  };

  Overlay.prototype.handleOpen = function (contentEl) {
    var _a = this.attrs,
        addToStack = _a.addToStack,
        closeOnOutsideClick = _a.closeOnOutsideClick,
        closeOnEscapeKey = _a.closeOnEscapeKey,
        hasBackdrop = _a.hasBackdrop,
        onOpened = _a.onOpened,
        inline = _a.inline;
    this.contentEl = contentEl;

    if (addToStack) {
      Overlay.openStack.push(this.id);
    }

    if (closeOnOutsideClick && !hasBackdrop) {
      document.addEventListener('mousedown', this.handleDocumentMouseDown);
    }

    if (closeOnEscapeKey) {
      document.addEventListener('keydown', this.handleKeyDown);
    }

    this.handleEnterTransition();

    if (hasBackdrop && !inline) {
      document.body.classList.add(_shared.Classes.OVERLAY_OPEN);
      var bodyHasScrollbar = (0, _shared.hasScrollbar)(document.body);

      if (bodyHasScrollbar) {
        document.body.style.paddingRight = (0, _shared.getScrollbarWidth)() + "px";
      }
    }

    (0, _shared.safeCall)(onOpened, contentEl);
    this.handleFocus();
  };

  Overlay.prototype.handleClose = function () {
    document.removeEventListener('mousedown', this.handleDocumentMouseDown);
    document.removeEventListener('keydown', this.handleKeyDown);
    this.handleExitTransition();
  };

  Overlay.prototype.handleClosed = function () {
    var _this = this;

    var _a = this.attrs,
        restoreFocus = _a.restoreFocus,
        onClosed = _a.onClosed,
        hasBackdrop = _a.hasBackdrop,
        inline = _a.inline;

    if (this.attrs.addToStack) {
      Overlay.openStack = Overlay.openStack.filter(function (id) {
        return id !== _this.id;
      });
    }

    if (this.lastActiveElement && restoreFocus) {
      window.requestAnimationFrame(function () {
        return _this.lastActiveElement.focus();
      });
    }

    if (hasBackdrop && !inline) {
      document.body.classList.remove(_shared.Classes.OVERLAY_OPEN);
      document.body.style.paddingRight = '';
    }

    (0, _shared.safeCall)(onClosed);
  };

  Overlay.prototype.handleEnterTransition = function () {
    var _a = this.attrs,
        transitionName = _a.transitionName,
        transitionDuration = _a.transitionDuration;
    var el = this.contentEl;
    if (el == null || transitionDuration === 0) return;
    el.classList.remove(transitionName + "-exit");
    el.classList.remove(transitionName + "-exit-active");
    el.classList.add(transitionName + "-enter"); // tslint:disable-next-line:no-unused-expression

    el.scrollTop;
    el.classList.add(transitionName + "-enter-active");
  };

  Overlay.prototype.handleExitTransition = function () {
    var _a = this.attrs,
        transitionDuration = _a.transitionDuration,
        transitionName = _a.transitionName;
    var el = this.contentEl;
    if (el == null || transitionDuration === 0) return;
    el.classList.remove(transitionName + "-enter");
    el.classList.remove(transitionName + "-enter-active");
    el.classList.add(transitionName + "-exit"); // tslint:disable-next-line:no-unused-expression

    el.scrollTop;
    el.classList.add(transitionName + "-exit-active");
  };

  Overlay.prototype.handleFocus = function () {
    this.lastActiveElement = document.activeElement;
    var contentEl = this.contentEl;
    var _a = this.attrs,
        isOpen = _a.isOpen,
        autofocus = _a.autofocus;

    if (!contentEl || !document.activeElement || !isOpen || !autofocus) {
      return;
    }

    window.requestAnimationFrame(function () {
      var isFocusOutsideOverlay = !contentEl.contains(document.activeElement);

      if (isFocusOutsideOverlay) {
        var autofocusEl = contentEl.querySelector('[autofocus]');
        var tabIndexEl = contentEl.querySelector('[tabindex]');

        if (autofocusEl) {
          autofocusEl.focus();
        } else if (tabIndexEl) {
          tabIndexEl.focus();
        }
      }
    });
  };

  Object.defineProperty(Overlay.prototype, "lastOpened", {
    get: function () {
      return this.attrs.addToStack ? Overlay.getLastOpened() === this.id : true;
    },
    enumerable: false,
    configurable: true
  });
  Overlay.openStack = [];

  Overlay.getLastOpened = function () {
    return Overlay.openStack[Overlay.openStack.length - 1];
  };

  return Overlay;
}(_abstractComponent.AbstractComponent);

exports.Overlay = Overlay;
},{"tslib":"../node_modules/tslib/tslib.es6.js","classnames":"../node_modules/classnames/index.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js","../portal":"../node_modules/construct-ui/lib/esm/components/portal/index.js","../../utils":"../node_modules/construct-ui/lib/esm/utils/index.js"}],"../node_modules/construct-ui/lib/esm/components/popover/Popover.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Popover = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _popper = _interopRequireDefault(require("popper.js"));

var _shared = require("../../_shared");

var _abstractComponent = require("../abstract-component");

var _overlay = require("../overlay");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Popover =
/** @class */
function (_super) {
  (0, _tslib.__extends)(Popover, _super);

  function Popover() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.handleOpened = function (contentEl) {
      if (!_this.popper && contentEl) {
        var popoverEl = contentEl.querySelector("." + _shared.Classes.POPOVER);

        _this.createPopper(popoverEl);

        (0, _shared.safeCall)(_this.attrs.onOpened, contentEl);
      }
    };

    _this.handleClosed = function () {
      _this.destroyPopper();

      (0, _shared.safeCall)(_this.attrs.onClosed);
    };

    _this.handleOverlayClose = function (e) {
      var target = e.target;
      var isTriggerClick = (0, _shared.elementIsOrContains)(_this.trigger.dom, target);

      if (!isTriggerClick || e instanceof KeyboardEvent) {
        _this.isControlled ? _this.handleInteraction(e) : _this.isOpen = false;
      }
    };

    _this.handlePopoverClick = function (e) {
      var target = e.target;
      var hasDimiss = (0, _shared.getClosest)(target, "." + _shared.Classes.POPOVER_DISSMISS) != null;

      if (_this.attrs.closeOnContentClick || hasDimiss) {
        _this.isControlled ? _this.handleInteraction(e) : _this.isOpen = false;
      } else e.redraw = false;
    };

    _this.handleTriggerMouseEnter = function (e) {
      var _a = _this.attrs,
          hoverOpenDelay = _a.hoverOpenDelay,
          interactionType = _a.interactionType;

      if (interactionType !== 'hover-trigger') {
        _this.clearTimeouts();
      }

      if (!_this.isOpen && _this.isHoverInteraction()) {
        if (hoverOpenDelay > 0) {
          _this.setTimeout(function () {
            _this.isOpen = true;

            _mithril.default.redraw();
          }, hoverOpenDelay);
        } else {
          _this.isOpen = true;

          _mithril.default.redraw();
        }
      }

      e.redraw = false;
    };

    _this.handleTriggerMouseLeave = function (e) {
      var hoverCloseDelay = _this.attrs.hoverCloseDelay;

      _this.clearTimeouts();

      if (_this.isOpen && _this.isHoverInteraction()) {
        if (hoverCloseDelay > 0) {
          _this.setTimeout(function () {
            _this.isOpen = false;

            _mithril.default.redraw();
          }, hoverCloseDelay);
        } else {
          _this.isOpen = false;

          _mithril.default.redraw();
        }
      }

      e.redraw = false;
    };

    _this.getContentOffset = function (data, containerEl) {
      if (!_this.attrs.hasArrow) {
        return data;
      }

      var placement = data.placement;
      var isHorizontal = placement.includes('left') || placement.includes('right');
      var position = isHorizontal ? 'left' : 'top';
      var arrowSize = containerEl.children[0].clientHeight + 1;
      var offset = placement.includes('top') || placement.includes('left') ? -arrowSize : arrowSize;
      data.offsets.popper[position] += offset;
      return data;
    };

    return _this;
  }

  Popover.prototype.getDefaultAttrs = function () {
    return {
      boundariesEl: 'window',
      restoreFocus: false,
      hasBackdrop: false,
      hoverCloseDelay: 100,
      hoverOpenDelay: 0,
      interactionType: 'click',
      position: 'bottom',
      hasArrow: true
    };
  };

  Popover.prototype.oninit = function (vnode) {
    _super.prototype.oninit.call(this, vnode);

    var _a = this.attrs,
        isOpen = _a.isOpen,
        defaultIsOpen = _a.defaultIsOpen;
    this.isOpen = isOpen != null ? isOpen : defaultIsOpen != null ? defaultIsOpen : false;
  };

  Popover.prototype.onbeforeupdate = function (vnode, old) {
    _super.prototype.onbeforeupdate.call(this, vnode, old);

    var isOpen = vnode.attrs.isOpen;
    var wasOpen = old.attrs.isOpen;

    if (isOpen && !wasOpen) {
      this.isOpen = true;
    } else if (!isOpen && wasOpen) {
      this.isOpen = false;
    }
  };

  Popover.prototype.onupdate = function () {
    if (this.popper) {
      this.popper.options.placement = this.attrs.position;
      this.popper.scheduleUpdate();
    }
  };

  Popover.prototype.onremove = function () {
    this.destroyPopper();
  };

  Popover.prototype.view = function () {
    var _a = this.attrs,
        className = _a.class,
        style = _a.style,
        content = _a.content,
        hasArrow = _a.hasArrow,
        trigger = _a.trigger,
        interactionType = _a.interactionType,
        inline = _a.inline,
        backdropClass = _a.backdropClass,
        overlayClass = _a.overlayClass,
        overlayStyle = _a.overlayStyle;
    this.trigger = trigger;
    this.setTriggerAttrs();
    var innerContent = (0, _mithril.default)('', {
      class: (0, _classnames.default)(_shared.Classes.POPOVER, className),
      onclick: this.handlePopoverClick,
      onmouseenter: this.handleTriggerMouseEnter,
      onmouseleave: this.handleTriggerMouseLeave,
      style: style
    }, [hasArrow && (0, _mithril.default)("." + _shared.Classes.POPOVER_ARROW), (0, _mithril.default)("." + _shared.Classes.POPOVER_CONTENT, content)]);
    return _mithril.default.fragment({}, [this.trigger, (0, _mithril.default)(_overlay.Overlay, (0, _tslib.__assign)((0, _tslib.__assign)({
      restoreFocus: this.isClickInteraction()
    }, this.attrs), {
      backdropClass: (0, _classnames.default)(_shared.Classes.POPOVER_BACKDROP, backdropClass),
      class: overlayClass,
      closeOnOutsideClick: interactionType !== 'click-trigger',
      content: innerContent,
      inline: inline,
      isOpen: this.isOpen,
      onClose: this.handleOverlayClose,
      onOpened: this.handleOpened,
      onClosed: this.handleClosed,
      style: overlayStyle
    }))]);
  };

  Popover.prototype.createPopper = function (el) {
    var _this = this;

    var _a = this.attrs,
        position = _a.position,
        hasArrow = _a.hasArrow,
        boundariesEl = _a.boundariesEl,
        modifiers = _a.modifiers;
    var options = {
      placement: position,
      modifiers: (0, _tslib.__assign)({
        arrow: {
          enabled: hasArrow,
          element: "." + _shared.Classes.POPOVER_ARROW
        },
        offset: {
          enabled: hasArrow,
          fn: function (data) {
            return _this.getContentOffset(data, el);
          }
        },
        preventOverflow: {
          enabled: true,
          boundariesElement: boundariesEl,
          padding: 0
        }
      }, modifiers)
    };
    this.popper = new _popper.default(this.trigger.dom, el, options);
  };

  Popover.prototype.destroyPopper = function () {
    if (this.popper) {
      this.popper.destroy();
      this.popper = undefined;
    }
  };

  Popover.prototype.setTriggerAttrs = function () {
    var _this = this;

    var isControlled = this.isControlled;

    if (!this.trigger.attrs) {
      this.trigger.attrs = {};
    }

    var triggerAttrs = this.trigger.attrs;

    if (this.isOpen) {
      triggerAttrs.class = (0, _classnames.default)(triggerAttrs.className || triggerAttrs.class, _shared.Classes.ACTIVE, _shared.Classes.POPOVER_TRIGGER_ACTIVE);
    } else triggerAttrs.class = triggerAttrs.className || triggerAttrs.class || '';

    var triggerEvents = {
      onmouseenter: triggerAttrs.onmouseenter,
      onmouseleave: triggerAttrs.onmouseleave,
      onfocus: triggerAttrs.onfocus,
      onblur: triggerAttrs.onblur,
      onclick: triggerAttrs.onclick
    };

    if (this.isClickInteraction()) {
      triggerAttrs.onclick = function (e) {
        isControlled ? _this.handleInteraction(e) : _this.handleTriggerClick();
        (0, _shared.safeCall)(triggerEvents.onclick);
      };
    } else {
      triggerAttrs.onmouseenter = function (e) {
        isControlled ? _this.handleInteraction(e) : _this.handleTriggerMouseEnter(e);
        (0, _shared.safeCall)(triggerEvents.onmouseenter);
      };

      triggerAttrs.onmouseleave = function (e) {
        isControlled ? _this.handleInteraction(e) : _this.handleTriggerMouseLeave(e);
        (0, _shared.safeCall)(triggerEvents.onmouseleave);
      };

      triggerAttrs.onfocus = function (e) {
        isControlled ? _this.handleInteraction(e) : _this.handleTriggerFocus(e);
        (0, _shared.safeCall)(triggerEvents.onfocus);
      };

      triggerAttrs.onblur = function (e) {
        isControlled ? _this.handleInteraction(e) : _this.handleTriggerBlur(e);
        (0, _shared.safeCall)(triggerEvents.onblur);
      };
    }
  };

  Popover.prototype.handleInteraction = function (e) {
    (0, _shared.safeCall)(this.attrs.onInteraction, !this.isOpen, e);
  };

  Popover.prototype.handleTriggerClick = function () {
    this.isOpen = !this.isOpen;
  };

  Popover.prototype.handleTriggerFocus = function (e) {
    if (this.attrs.openOnTriggerFocus) {
      this.handleTriggerMouseEnter(e);
    } else e.redraw = false;
  };

  Popover.prototype.handleTriggerBlur = function (e) {
    if (this.attrs.openOnTriggerFocus) {
      this.handleTriggerMouseLeave(e);
    } else e.redraw = false;
  };

  Popover.prototype.isHoverInteraction = function () {
    var interactionType = this.attrs.interactionType;
    return interactionType === 'hover' || interactionType === 'hover-trigger';
  };

  Popover.prototype.isClickInteraction = function () {
    var interactionType = this.attrs.interactionType;
    return interactionType === 'click' || interactionType === 'click-trigger';
  };

  Object.defineProperty(Popover.prototype, "isControlled", {
    get: function () {
      return this.attrs.isOpen != null;
    },
    enumerable: false,
    configurable: true
  });
  return Popover;
}(_abstractComponent.AbstractComponent);

exports.Popover = Popover;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","popper.js":"../node_modules/popper.js/dist/esm/popper.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js","../overlay":"../node_modules/construct-ui/lib/esm/components/overlay/index.js"}],"../node_modules/construct-ui/lib/esm/components/popover/popoverTypes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopoverPosition = exports.PopoverInteraction = void 0;
var PopoverInteraction = {
  CLICK: 'click',
  CLICK_TRIGGER: 'click-trigger',
  HOVER: 'hover',
  HOVER_TRIGGER: 'hover-trigger'
};
exports.PopoverInteraction = PopoverInteraction;
var PopoverPosition = {
  AUTO: 'auto',
  AUTO_START: 'auto-start',
  AUTO_END: 'auto-end',
  TOP: 'top',
  TOP_START: 'top-start',
  TOP_END: 'top-end',
  RIGHT: 'right',
  RIGHT_START: 'right-start',
  RIGHT_END: 'right-end',
  BOTTOM: 'bottom',
  BOTTOM_START: 'bottom-start',
  BOTTOM_END: 'bottom-end',
  LEFT: 'left',
  LEFT_START: 'left-start',
  LEFT_END: 'left-end'
};
exports.PopoverPosition = PopoverPosition;
},{}],"../node_modules/construct-ui/lib/esm/components/popover/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Popover = require("./Popover");

Object.keys(_Popover).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Popover[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Popover[key];
    }
  });
});

var _popoverTypes = require("./popoverTypes");

Object.keys(_popoverTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _popoverTypes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _popoverTypes[key];
    }
  });
});
},{"./Popover":"../node_modules/construct-ui/lib/esm/components/popover/Popover.js","./popoverTypes":"../node_modules/construct-ui/lib/esm/components/popover/popoverTypes.js"}],"../node_modules/lodash.debounce/index.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

},{}],"../node_modules/construct-ui/lib/esm/components/list/List.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var List =
/** @class */
function () {
  function List() {}

  List.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var className = attrs.class,
        size = attrs.size,
        _b = attrs.interactive,
        interactive = _b === void 0 ? true : _b,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "size", "interactive"]);
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: (0, _classnames.default)(_shared.Classes.LIST, interactive && _shared.Classes.INTERACTIVE, size && "cui-" + size, className)
    }), children);
  };

  return List;
}();

exports.List = List;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/util/support/isBufferBrowser.js":[function(require,module,exports) {
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/util/node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/util/util.js":[function(require,module,exports) {
var process = require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
  var keys = Object.keys(obj);
  var descriptors = {};

  for (var i = 0; i < keys.length; i++) {
    descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
  }

  return descriptors;
};

var formatRegExp = /%[sdj%]/g;

exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];

    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }

    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;

    switch (x) {
      case '%s':
        return String(args[i++]);

      case '%d':
        return Number(args[i++]);

      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }

      default:
        return x;
    }
  });

  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }

  return str;
}; // Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.


exports.deprecate = function (fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  } // Allow for deprecating things in the process of starting up.


  if (typeof process === 'undefined') {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;

exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = undefined || '';
  set = set.toUpperCase();

  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;

      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }

  return debugs[set];
};
/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */

/* legacy: obj, showHidden, depth, colors*/


function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  }; // legacy...

  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  } // set default options


  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
}; // Don't use 'blue' not visible on cmd.exe

inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};
  array.forEach(function (val, idx) {
    hash[val] = true;
  });
  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);

    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }

    return ret;
  } // Primitive types cannot have properties


  var primitive = formatPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  } // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  } // Some type of object without properties can be shortcutted.


  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }

    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }

    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}']; // Make Array say that they are Array

  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  } // Make functions say that they are functions


  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  } // Make RegExps say that they are RegExps


  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  } // Make dates with properties first say the date


  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  } // Make error with message first say the error


  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);
  var output;

  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }

  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];

  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }

  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || {
    value: value[key]
  };

  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }

  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }

      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }

  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }

    name = JSON.stringify('' + key);

    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
} // NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.


function isArray(ar) {
  return Array.isArray(ar);
}

exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}

exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}

exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}

exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

exports.isPrimitive = isPrimitive;
exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
} // log is just a thin wrapper to console.log that prepends a timestamp


exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */


exports.inherits = require('inherits');

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;
  var keys = Object.keys(add);
  var i = keys.length;

  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }

  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];

    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }

    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true
  });
  return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
};

exports.promisify.custom = kCustomPromisifiedSymbol;

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }

  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  } // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.


  function callbackified() {
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();

    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }

    var self = this;

    var cb = function () {
      return maybeCb.apply(self, arguments);
    }; // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)


    original.apply(this, args).then(function (ret) {
      process.nextTick(cb, null, ret);
    }, function (rej) {
      process.nextTick(callbackifyOnRejected, rej, cb);
    });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
  return callbackified;
}

exports.callbackify = callbackify;
},{"./support/isBuffer":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/util/support/isBufferBrowser.js","inherits":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/util/node_modules/inherits/inherits_browser.js","process":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../node_modules/construct-ui/lib/esm/components/list/ListItem.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListItem = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListItem =
/** @class */
function () {
  function ListItem() {}

  ListItem.prototype.view = function (_a) {
    var _this = this;

    var attrs = _a.attrs;
    var active = attrs.active,
        className = attrs.class,
        contentLeft = attrs.contentLeft,
        contentRight = attrs.contentRight,
        disabled = attrs.disabled,
        selected = attrs.selected,
        label = attrs.label,
        onclick = attrs.onclick,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["active", "class", "contentLeft", "contentRight", "disabled", "selected", "label", "onclick"]);
    var classes = (0, _classnames.default)(_shared.Classes.LIST_ITEM, active && _shared.Classes.ACTIVE, disabled && _shared.Classes.DISABLED, selected && _shared.Classes.SELECTED, className);
    var content = [contentLeft && (0, _mithril.default)("." + _shared.Classes.LIST_ITEM_CONTENT_LEFT, contentLeft), label, contentRight && (0, _mithril.default)("." + _shared.Classes.LIST_ITEM_CONTENT_RIGHT, contentRight)];
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes,
      onclick: function (e) {
        return _this.handleClick(e, attrs);
      }
    }), content);
  };

  ListItem.prototype.handleClick = function (e, attrs) {
    var allowOnContentClick = attrs.allowOnContentClick,
        onclick = attrs.onclick;
    var el = e.target;
    var isLeftContentClick = (0, _shared.getClosest)(el, "." + _shared.Classes.LIST_ITEM_CONTENT_LEFT);
    var isRightContentClick = (0, _shared.getClosest)(el, "." + _shared.Classes.LIST_ITEM_CONTENT_RIGHT);
    var allowContentClick = allowOnContentClick || !isLeftContentClick && !isRightContentClick;

    if ((0, _util.isFunction)(onclick) && allowContentClick) {
      (0, _shared.safeCall)(onclick, e);
    } else e.redraw = false;
  };

  return ListItem;
}();

exports.ListItem = ListItem;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","util":"../../../../../../usr/lib/node_modules/parcel-bundler/node_modules/util/util.js"}],"../node_modules/construct-ui/lib/esm/components/list/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _List = require("./List");

Object.keys(_List).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _List[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _List[key];
    }
  });
});

var _ListItem = require("./ListItem");

Object.keys(_ListItem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ListItem[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ListItem[key];
    }
  });
});
},{"./List":"../node_modules/construct-ui/lib/esm/components/list/List.js","./ListItem":"../node_modules/construct-ui/lib/esm/components/list/ListItem.js"}],"../node_modules/construct-ui/lib/esm/components/input/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Input =
/** @class */
function () {
  function Input() {}

  Input.prototype.oncreate = function (vnode) {
    this.updatePadding(vnode);
  };

  Input.prototype.onupdate = function (vnode) {
    this.updatePadding(vnode);
  };

  Input.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var basic = attrs.basic,
        className = attrs.class,
        contentLeft = attrs.contentLeft,
        contentRight = attrs.contentRight,
        disabled = attrs.disabled,
        fluid = attrs.fluid,
        intent = attrs.intent,
        size = attrs.size,
        style = attrs.style,
        // Prevent lifecycle methods from being passed through
    oninit = attrs.oninit,
        oncreate = attrs.oncreate,
        onbeforeupdate = attrs.onbeforeupdate,
        onupdate = attrs.onupdate,
        onbeforeremove = attrs.onbeforeremove,
        onremove = attrs.onremove,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["basic", "class", "contentLeft", "contentRight", "disabled", "fluid", "intent", "size", "style", "oninit", "oncreate", "onbeforeupdate", "onupdate", "onbeforeremove", "onremove"]);
    var classes = (0, _classnames.default)(_shared.Classes.INPUT, basic && _shared.Classes.BASIC, disabled && _shared.Classes.DISABLED, fluid && _shared.Classes.FLUID, intent && "cui-" + intent, size && "cui-" + size, className);
    var input = (0, _mithril.default)('input', (0, _tslib.__assign)({}, htmlAttrs));
    return (0, _mithril.default)('', {
      class: classes,
      style: style
    }, [contentLeft, input, contentRight]);
  };

  Input.prototype.updatePadding = function (_a) {
    var attrs = _a.attrs,
        dom = _a.dom;
    var containerEl = dom.querySelector('input');
    (0, _shared.updateElementGroupPadding)(containerEl, attrs.contentLeft, attrs.contentRight);
  };

  return Input;
}();

exports.Input = Input;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/query-list/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryList = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _lodash = _interopRequireDefault(require("lodash.debounce"));

var _shared = require("../../_shared");

var _abstractComponent = require("../abstract-component");

var _icon = require("../icon");

var _list = require("../list");

var _input = require("../input");

var _controlGroup = require("../control-group");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Credits go to Blueprintjs for API structure
// https://github.com/palantir/blueprint/blob/develop/packages/select/src/components/query-list/queryList.tsx
var QueryList =
/** @class */
function (_super) {
  (0, _tslib.__extends)(QueryList, _super);

  function QueryList() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.filteredItems = [];

    _this.renderItem = function (item, index) {
      var _a = _this.attrs,
          itemRender = _a.itemRender,
          disableArrowKeys = _a.disableArrowKeys,
          checkmark = _a.checkmark,
          listAttrs = _a.listAttrs;
      var listItem = itemRender(item, index);
      listItem.attrs = listItem.attrs || {};

      listItem.attrs.onclick = function (e) {
        return _this.handleSelect(index, listItem.attrs.disabled, e);
      };

      if (!disableArrowKeys && _this.activeIndex === index) {
        listItem.attrs.class = (0, _classnames.default)(listItem.attrs.className, listItem.attrs.class, _shared.Classes.ACTIVE);
      }

      if (listItem.tag === _list.ListItem) {
        if (listItem.attrs.selected && checkmark) {
          listItem.attrs.contentLeft = (0, _mithril.default)(_icon.Icon, {
            name: _icon.Icons.CHECK,
            size: listAttrs.size
          });
        }
      }

      return listItem;
    };

    _this.handleInput = function (e) {
      _this.handleSearchDebounce(e);

      e.redraw = false;
    };

    _this.handleSearchDebounce = (0, _lodash.default)(function (e) {
      var value = e.target.value;

      _this.updateQuery(value);

      _this.filteredItems = _this.getFilteredItems();

      _this.updateActiveIndex(0);

      _mithril.default.redraw();
    }, 200);

    _this.handleInputClear = function () {
      _this.updateQuery('');

      _this.updateActiveIndex(0);

      _this.filteredItems = _this.getFilteredItems();

      _this.scrollToActiveItem();

      if (_this.inputEl) {
        _this.inputEl.focus();
      }
    };

    _this.handleSelect = function (index, isDisabled, e) {
      var onSelect = _this.attrs.onSelect;
      var target = e.target;
      var selectedItem = _this.filteredItems[index];
      var actionsEl = (0, _shared.getClosest)(target, "." + _shared.Classes.LIST_ITEM_CONTENT_RIGHT);

      if (selectedItem != null && !actionsEl && !isDisabled) {
        _this.updateActiveIndex(index);

        (0, _shared.safeCall)(onSelect, selectedItem, e, index);
      } else e.redraw = false;
    };

    _this.handleKeyDown = function (e) {
      var key = e.which;

      switch (key) {
        case _shared.Keys.ARROW_UP:
        case _shared.Keys.ARROW_DOWN:
          if (!_this.attrs.disableArrowKeys) {
            e.preventDefault();

            _this.moveActiveIndex(key === _shared.Keys.ARROW_UP ? 'up' : 'down');

            _mithril.default.redraw();
          }

          break;

        case _shared.Keys.ESCAPE:
          if (_this.query) {
            _this.handleInputClear();

            _mithril.default.redraw();
          }

          break;

        case _shared.Keys.ENTER:
          _this.handleEnterKey(e);

          _mithril.default.redraw();

          break;

        default:
          break;
      }

      e.redraw = false;
    };

    return _this;
  }

  QueryList.ofType = function () {
    return QueryList;
  };

  QueryList.prototype.getDefaultAttrs = function () {
    return {
      cacheItems: true,
      checkmark: true,
      inputAttrs: {},
      listAttrs: {},
      filterable: true,
      controlGroupAttrs: {},
      emptyContent: 'No items available.'
    };
  };

  QueryList.prototype.oninit = function (vnode) {
    _super.prototype.oninit.call(this, vnode);

    this.query = this.attrs.defaultQuery || '';
    this.activeIndex = this.attrs.defaultActiveIndex || 0;
    this.setControlledAttrs();
    this.filteredItems = this.getFilteredItems();
  };

  QueryList.prototype.oncreate = function (_a) {
    var dom = _a.dom;
    this.listEl = dom.querySelector("." + _shared.Classes.LIST);
    this.inputEl = dom.querySelector("." + _shared.Classes.INPUT);
    this.scrollToActiveItem();
  };

  QueryList.prototype.onbeforeupdate = function (vnode, old) {
    _super.prototype.onbeforeupdate.call(this, vnode, old);

    this.setControlledAttrs();

    if (vnode.attrs.items !== old.attrs.items || vnode.attrs.query !== old.attrs.query || vnode.attrs.activeIndex !== old.attrs.activeIndex || !vnode.attrs.cacheItems) {
      this.filteredItems = this.getFilteredItems();
      this.scrollToActiveItem();
    }
  };

  QueryList.prototype.view = function () {
    var _a = this.attrs,
        activeIndex = _a.activeIndex,
        cacheItems = _a.cacheItems,
        checkmark = _a.checkmark,
        className = _a.class,
        controlGroupAttrs = _a.controlGroupAttrs,
        contentLeft = _a.contentLeft,
        contentRight = _a.contentRight,
        defaultActiveIndex = _a.defaultActiveIndex,
        defaultQuery = _a.defaultQuery,
        emptyContent = _a.emptyContent,
        eventCallbacks = _a.eventCallbacks,
        filterable = _a.filterable,
        initialContent = _a.initialContent,
        inputAttrs = _a.inputAttrs,
        itemPredicate = _a.itemPredicate,
        itemListPredicate = _a.itemListPredicate,
        itemListRender = _a.itemListRender,
        itemRender = _a.itemRender,
        items = _a.items,
        listAttrs = _a.listAttrs,
        onActiveItemChange = _a.onActiveItemChange,
        onSelect = _a.onSelect,
        query = _a.query,
        onQueryChange = _a.onQueryChange,
        htmlAttrs = (0, _tslib.__rest)(_a, ["activeIndex", "cacheItems", "checkmark", "class", "controlGroupAttrs", "contentLeft", "contentRight", "defaultActiveIndex", "defaultQuery", "emptyContent", "eventCallbacks", "filterable", "initialContent", "inputAttrs", "itemPredicate", "itemListPredicate", "itemListRender", "itemRender", "items", "listAttrs", "onActiveItemChange", "onSelect", "query", "onQueryChange"]);
    var classes = (0, _classnames.default)(_shared.Classes.QUERY_LIST, checkmark && _shared.Classes.QUERY_LIST_CHECKMARK, className);
    (0, _shared.safeCall)(eventCallbacks, {
      handleKeyDown: this.handleKeyDown
    });
    var innerContent = [filterable && this.renderControlGroup(), this.renderList()];
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes,
      onkeydown: this.handleKeyDown,
      tabindex: 0
    }), innerContent);
  };

  QueryList.prototype.renderControlGroup = function () {
    var _a = this.attrs,
        inputAttrs = _a.inputAttrs,
        controlGroupAttrs = _a.controlGroupAttrs,
        contentLeft = _a.contentLeft,
        contentRight = _a.contentRight;
    return (0, _mithril.default)(_controlGroup.ControlGroup, (0, _tslib.__assign)((0, _tslib.__assign)({}, this.attrs.controlGroupAttrs), {
      class: (0, _classnames.default)(_shared.Classes.FLUID, controlGroupAttrs.class)
    }), [contentLeft, (0, _mithril.default)(_input.Input, (0, _tslib.__assign)((0, _tslib.__assign)({
      placeholder: 'Search items...'
    }, inputAttrs), {
      oninput: this.handleInput,
      contentRight: this.query.length !== 0 ? (0, _mithril.default)(_icon.Icon, {
        name: _icon.Icons.X,
        onclick: this.handleInputClear
      }) : inputAttrs.contentRight,
      value: this.query
    })), contentRight]);
  };

  QueryList.prototype.renderList = function () {
    var _a = this.attrs,
        listAttrs = _a.listAttrs,
        emptyContent = _a.emptyContent,
        initialContent = _a.initialContent;
    this.itemNodes = this.filteredItems.map(this.renderItem);
    var isEmpty = this.filteredItems.length === 0;
    var hasInitialContent = initialContent && this.query === '';
    var classes = (0, _classnames.default)(isEmpty && _shared.Classes.QUERY_LIST_EMPTY, hasInitialContent && _shared.Classes.QUERY_LIST_INITIAL, listAttrs.class);
    var emptyOrInitialContent = (0, _mithril.default)("." + _shared.Classes.QUERY_LIST_MESSAGE, hasInitialContent && !isEmpty && initialContent, isEmpty && emptyContent);
    var content = hasInitialContent || isEmpty ? emptyOrInitialContent : this.itemNodes;
    return (0, _mithril.default)(_list.List, (0, _tslib.__assign)((0, _tslib.__assign)({}, listAttrs), {
      class: classes
    }), content);
  };

  QueryList.prototype.setControlledAttrs = function () {
    var _a = this.attrs,
        activeIndex = _a.activeIndex,
        query = _a.query;

    if (query != null) {
      this.query = query;
    }

    if (activeIndex != null) {
      this.activeIndex = activeIndex === -1 ? 0 : activeIndex;
    }
  };

  QueryList.prototype.scrollToActiveItem = function () {
    var _a = this,
        listEl = _a.listEl,
        activeIndex = _a.activeIndex;

    if (listEl && activeIndex >= 0) {
      var activeEl = listEl.children[activeIndex];
      if (!activeEl) return;
      var activeTop = activeEl.offsetTop,
          activeHeight = activeEl.offsetHeight;
      var listScrollTop = listEl.scrollTop,
          listHeight = listEl.clientHeight;
      var activeBottomEdge = activeTop + activeHeight;
      var activeTopEdge = activeTop;

      if (activeBottomEdge >= listScrollTop + listHeight) {
        listEl.scrollTop = activeBottomEdge + activeHeight - listHeight;
      } else if (activeTopEdge <= listScrollTop) {
        listEl.scrollTop = activeTopEdge - activeHeight;
      }
    }
  };

  Object.defineProperty(QueryList.prototype, "activeItem", {
    get: function () {
      return this.filteredItems[this.activeIndex];
    },
    enumerable: false,
    configurable: true
  });

  QueryList.prototype.updateQuery = function (text) {
    var _a = this.attrs,
        query = _a.query,
        onQueryChange = _a.onQueryChange;

    if (query != null) {
      (0, _shared.safeCall)(onQueryChange, text);
    } else this.query = text;
  };

  QueryList.prototype.moveActiveIndex = function (direction) {
    var activeIndex = this.activeIndex;
    var index = getNextIndex(activeIndex, this.itemNodes, direction);
    this.updateActiveIndex(index);
    this.scrollToActiveItem();
  };

  QueryList.prototype.updateActiveIndex = function (index) {
    var _a = this.attrs,
        activeIndex = _a.activeIndex,
        onActiveItemChange = _a.onActiveItemChange;
    var currentIndex = index > this.filteredItems.length ? 0 : index;

    if (activeIndex != null) {
      (0, _shared.safeCall)(onActiveItemChange, this.activeItem, currentIndex);
    } else this.activeIndex = currentIndex;
  };

  QueryList.prototype.handleEnterKey = function (e) {
    var item = this.activeItem;

    if (item != null) {
      (0, _shared.safeCall)(this.attrs.onSelect, item, e);
    }
  };

  QueryList.prototype.getFilteredItems = function () {
    var _this = this;

    var _a = this.attrs,
        items = _a.items,
        itemPredicate = _a.itemPredicate,
        itemListPredicate = _a.itemListPredicate;

    if ((0, _shared.isFunction)(itemListPredicate)) {
      return itemListPredicate(this.query, items);
    }

    if ((0, _shared.isFunction)(itemPredicate)) {
      return items.filter(function (item, index) {
        return itemPredicate(_this.query, item, index);
      });
    }

    return items;
  };

  return QueryList;
}(_abstractComponent.AbstractComponent);

exports.QueryList = QueryList;

function getNextIndex(currentIndex, vnodes, direction) {
  var maxIndex = vnodes.length - 1;
  var index = currentIndex;
  var flag = true;

  if (index < 0 || maxIndex <= 0) {
    return 0;
  }

  while (flag) {
    index = direction === 'up' ? index === 0 ? maxIndex : index - 1 : index === maxIndex ? 0 : index + 1;
    var vnode = vnodes[index];
    var attrs = vnode && vnode.attrs;

    if (attrs && !attrs.disabled) {
      flag = false;
    }
  }

  return index;
}
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","lodash.debounce":"../node_modules/lodash.debounce/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js","../list":"../node_modules/construct-ui/lib/esm/components/list/index.js","../input":"../node_modules/construct-ui/lib/esm/components/input/index.js","../control-group":"../node_modules/construct-ui/lib/esm/components/control-group/index.js"}],"../node_modules/construct-ui/lib/esm/components/select-list/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectList = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _popover = require("../popover");

var _abstractComponent = require("../abstract-component");

var _spinner = require("../spinner");

var _queryList = require("../query-list");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectList =
/** @class */
function (_super) {
  (0, _tslib.__extends)(SelectList, _super);

  function SelectList() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.queryList = _queryList.QueryList.ofType();
    _this.activeIndex = 0;

    _this.handleActiveItemChange = function (activeItem, index) {
      _this.activeIndex = index;
      (0, _shared.safeCall)(_this.attrs.onActiveItemChange, activeItem, index);
    };

    _this.handleSelect = function (item, e, index) {
      var _a = _this.attrs,
          onSelect = _a.onSelect,
          closeOnSelect = _a.closeOnSelect;

      if (closeOnSelect) {
        _this.isOpen = false;
      }

      (0, _shared.safeCall)(onSelect, item, e, index);
    };

    _this.handlePopoverInteraction = function (nextOpenState, e) {
      var _a = _this.attrs.popoverAttrs,
          isOpen = _a.isOpen,
          onInteraction = _a.onInteraction;

      if (isOpen != null) {
        (0, _shared.safeCall)(onInteraction, nextOpenState, e);
      } else _this.isOpen = nextOpenState;
    };

    return _this;
  }

  SelectList.ofType = function () {
    return SelectList;
  };

  SelectList.prototype.getDefaultAttrs = function () {
    return {
      closeOnSelect: true,
      popoverAttrs: {},
      inputAttrs: {}
    };
  };

  SelectList.prototype.oninit = function (vnode) {
    _super.prototype.oninit.call(this, vnode);

    var _a = vnode.attrs.popoverAttrs,
        isOpen = _a.isOpen,
        defaultIsOpen = _a.defaultIsOpen;
    this.isOpen = isOpen != null ? isOpen : defaultIsOpen != null ? defaultIsOpen : false;
  };

  SelectList.prototype.onbeforeupdate = function (vnode, old) {
    _super.prototype.onbeforeupdate.call(this, vnode, old);

    var isOpen = vnode.attrs.popoverAttrs.isOpen;
    var wasOpen = old.attrs.popoverAttrs.isOpen;

    if (isOpen && !wasOpen) {
      this.isOpen = true;
    } else if (!isOpen && wasOpen) {
      this.isOpen = false;
    }
  };

  SelectList.prototype.view = function () {
    var _a = this.attrs,
        className = _a.class,
        popoverAttrs = _a.popoverAttrs,
        header = _a.header,
        footer = _a.footer,
        trigger = _a.trigger,
        closeOnSelect = _a.closeOnSelect,
        loading = _a.loading,
        queryListAttrs = (0, _tslib.__rest)(_a, ["class", "popoverAttrs", "header", "footer", "trigger", "closeOnSelect", "loading"]);
    var queryList = (0, _mithril.default)(this.queryList, (0, _tslib.__assign)((0, _tslib.__assign)({
      activeIndex: this.activeIndex,
      onActiveItemChange: this.handleActiveItemChange
    }, queryListAttrs), {
      inputAttrs: (0, _tslib.__assign)((0, _tslib.__assign)({}, queryListAttrs.inputAttrs), {
        autofocus: true
      }),
      onSelect: this.handleSelect
    }));
    var content = [header, (0, _mithril.default)(_spinner.Spinner, {
      active: loading,
      background: true,
      fill: true
    }), queryList, footer];
    return (0, _mithril.default)(_popover.Popover, (0, _tslib.__assign)((0, _tslib.__assign)({
      autofocus: true,
      position: 'bottom-start',
      closeOnEscapeKey: false
    }, popoverAttrs), {
      class: (0, _classnames.default)(_shared.Classes.SELECT_LIST, className, popoverAttrs.class),
      isOpen: this.isOpen,
      content: content,
      onInteraction: this.handlePopoverInteraction,
      trigger: trigger
    }));
  };

  return SelectList;
}(_abstractComponent.AbstractComponent);

exports.SelectList = SelectList;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../popover":"../node_modules/construct-ui/lib/esm/components/popover/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js","../spinner":"../node_modules/construct-ui/lib/esm/components/spinner/index.js","../query-list":"../node_modules/construct-ui/lib/esm/components/query-list/index.js"}],"../node_modules/construct-ui/lib/esm/components/custom-select/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomSelect = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _abstractComponent = require("../abstract-component");

var _shared = require("../../_shared");

var _selectList = require("../select-list");

var _list = require("../list");

var _button = require("../button");

var _icon = require("../icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CustomSelect =
/** @class */
function (_super) {
  (0, _tslib.__extends)(CustomSelect, _super);

  function CustomSelect() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.activeIndex = 0;
    _this.isOpen = false;

    _this.renderItem = function (item, index) {
      var label = typeof item === 'object' ? item.label : item;
      var value = typeof item === 'object' ? item.value : item;
      var attrs = typeof item === 'object' ? item : {};
      var isSelected = _this.selectedValue === value;

      if (_this.attrs.itemRender) {
        return _this.attrs.itemRender(item, isSelected, index);
      }

      return (0, _mithril.default)(_list.ListItem, (0, _tslib.__assign)((0, _tslib.__assign)({}, attrs), {
        selected: isSelected,
        label: label
      }));
    };

    _this.handleSelect = function (item) {
      if (!('value' in _this.attrs)) {
        _this.selected = item;
      }

      (0, _shared.safeCall)(_this.attrs.onSelect, item);
      _this.isOpen = false;
    };

    _this.handleActiveItemChange = function (_activeItem, index) {
      _this.activeIndex = index;
    };

    _this.handleTriggerKeyDown = function (e) {
      var key = e.which;

      if (key === _shared.Keys.ARROW_UP || key === _shared.Keys.ARROW_DOWN) {
        e.preventDefault();
        var options = _this.attrs.options;

        var index = _this.attrs.options.indexOf(_this.selected);

        var direction = key === _shared.Keys.ARROW_UP ? 'up' : 'down';
        var nextIndex = getNextIndex(index, options, direction);
        _this.selected = options[nextIndex];
        _this.activeIndex = nextIndex;
      }

      if (key === _shared.Keys.SPACE) {
        _this.isOpen = true;
      }

      (0, _shared.safeCall)(_this.attrs.triggerAttrs.onkeydown, e);
    };

    _this.handlePopoverInteraction = function (nextOpenState) {
      _this.isOpen = nextOpenState;
    };

    return _this;
  }

  CustomSelect.prototype.getDefaultAttrs = function () {
    return {
      options: [],
      triggerAttrs: {}
    };
  };

  CustomSelect.prototype.oninit = function (vnode) {
    _super.prototype.oninit.call(this, vnode);

    this.setSelected();
  };

  CustomSelect.prototype.onbeforeupdate = function (vnode, old) {
    _super.prototype.onbeforeupdate.call(this, vnode, old);

    if (vnode.attrs.value !== old.attrs.value) {
      this.setSelected();
    }
  };

  CustomSelect.prototype.view = function () {
    var _a = this.attrs,
        options = _a.options,
        className = _a.class,
        name = _a.name,
        triggerAttrs = _a.triggerAttrs,
        size = _a.size;
    var classes = (0, _classnames.default)(_shared.Classes.CUSTOM_SELECT, className);
    var hiddenContainer = (0, _mithril.default)("." + _shared.Classes.CUSTOM_SELECT_HIDDEN, [(0, _mithril.default)('input', {
      class: _shared.Classes.CUSTOM_SELECT_INPUT,
      value: this.selectedValue,
      name: name
    })]);
    var trigger = (0, _mithril.default)(_button.Button, (0, _tslib.__assign)((0, _tslib.__assign)({
      class: _shared.Classes.CUSTOM_SELECT_TRIGGER,
      compact: true,
      label: [hiddenContainer, this.selectedLabel],
      iconRight: _icon.Icons.CHEVRON_DOWN,
      size: size
    }, triggerAttrs), {
      onkeydown: this.handleTriggerKeyDown
    }));
    var selectList = (0, _mithril.default)(_selectList.SelectList, {
      filterable: false,
      items: options,
      checkmark: false,
      itemRender: this.renderItem,
      activeIndex: this.activeIndex,
      closeOnSelect: false,
      onActiveItemChange: this.handleActiveItemChange,
      listAttrs: {
        size: size
      },
      popoverAttrs: {
        isOpen: this.isOpen,
        hasArrow: false,
        position: 'bottom',
        inline: true,
        boundariesEl: 'scrollParent',
        transitionDuration: 0,
        closeOnEscapeKey: true,
        onInteraction: this.handlePopoverInteraction
      },
      onSelect: this.handleSelect,
      trigger: trigger
    });
    return (0, _mithril.default)('', {
      class: classes
    }, selectList);
  };

  Object.defineProperty(CustomSelect.prototype, "selectedValue", {
    get: function () {
      var selected = this.selected;
      return selected != null ? typeof selected === 'object' ? selected.value : selected : '';
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(CustomSelect.prototype, "selectedLabel", {
    get: function () {
      var selected = this.selected;
      return selected != null ? typeof selected === 'object' ? selected.label : selected : '';
    },
    enumerable: false,
    configurable: true
  });

  CustomSelect.prototype.setSelected = function () {
    var _a = this.attrs,
        options = _a.options,
        value = _a.value,
        defaultValue = _a.defaultValue;

    if (options.length) {
      var firstOption = options[0];
      var selectedValue_1 = value || defaultValue;
      this.selected = typeof firstOption === 'object' ? options.find(function (x) {
        return x.value === selectedValue_1;
      }) : selectedValue_1;
      var index = options.indexOf(this.selected);
      this.activeIndex = index;
    }
  };

  return CustomSelect;
}(_abstractComponent.AbstractComponent);

exports.CustomSelect = CustomSelect;

// TODO: Combine with QueryList getNextIndex
function getNextIndex(currentIndex, options, direction) {
  var maxIndex = options.length - 1;
  var index = currentIndex;
  var flag = true;

  while (flag) {
    index = direction === 'up' ? index === 0 ? maxIndex : index - 1 : index === maxIndex ? 0 : index + 1;
    var option = options[index];

    if (typeof option === 'object' && !option.disabled) {
      flag = false;
    }
  }

  return index;
}
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../select-list":"../node_modules/construct-ui/lib/esm/components/select-list/index.js","../list":"../node_modules/construct-ui/lib/esm/components/list/index.js","../button":"../node_modules/construct-ui/lib/esm/components/button/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js"}],"../node_modules/construct-ui/lib/esm/components/dialog/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dialog = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _abstractComponent = require("../abstract-component");

var _shared = require("../../_shared");

var _overlay = require("../overlay");

var _button = require("../button");

var _icon = require("../icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dialog =
/** @class */
function (_super) {
  (0, _tslib.__extends)(Dialog, _super);

  function Dialog() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.handleContainerClick = function (e) {
      var _a = _this.attrs,
          closeOnOutsideClick = _a.closeOnOutsideClick,
          onClose = _a.onClose;
      var target = e.target;
      var isClickOutsideDialog = (0, _shared.getClosest)(target, "." + _shared.Classes.DIALOG_CONTENT) == null;

      if (isClickOutsideDialog && closeOnOutsideClick) {
        (0, _shared.safeCall)(onClose);
      } else e.redraw = false;
    };

    return _this;
  }

  Dialog.prototype.getDefaultAttrs = function () {
    return {
      hasCloseButton: true,
      closeOnOutsideClick: true
    };
  };

  Dialog.prototype.view = function () {
    var _a = this.attrs,
        basic = _a.basic,
        onClose = _a.onClose,
        hasCloseButton = _a.hasCloseButton,
        className = _a.class,
        footer = _a.footer,
        content = _a.content,
        style = _a.style,
        title = _a.title,
        otherAttrs = (0, _tslib.__rest)(_a, ["basic", "onClose", "hasCloseButton", "class", "footer", "content", "style", "title"]);
    var closeButton = (0, _mithril.default)(_button.Button, {
      class: _shared.Classes.DIALOG_CLOSE_BUTTON,
      basic: true,
      iconLeft: _icon.Icons.X,
      onclick: onClose ? function (e) {
        return onClose(e);
      } : undefined
    });
    var header = (0, _mithril.default)('', {
      class: _shared.Classes.DIALOG_HEADER
    }, [(0, _mithril.default)('h3', title), hasCloseButton && closeButton]);
    var innerContent = (0, _mithril.default)('', {
      class: _shared.Classes.DIALOG_CONTENT
    }, [title && header, (0, _mithril.default)('', {
      class: _shared.Classes.DIALOG_BODY
    }, content), footer && (0, _mithril.default)('', {
      class: _shared.Classes.DIALOG_FOOTER
    }, footer)]);
    var container = (0, _mithril.default)('', {
      class: (0, _classnames.default)(_shared.Classes.DIALOG, basic && _shared.Classes.BASIC, className),
      onclick: this.handleContainerClick,
      style: style
    }, innerContent);
    return (0, _mithril.default)(_overlay.Overlay, (0, _tslib.__assign)((0, _tslib.__assign)({}, otherAttrs), {
      onClose: onClose,
      content: container
    }));
  };

  return Dialog;
}(_abstractComponent.AbstractComponent);

exports.Dialog = Dialog;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../overlay":"../node_modules/construct-ui/lib/esm/components/overlay/index.js","../button":"../node_modules/construct-ui/lib/esm/components/button/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js"}],"../node_modules/construct-ui/lib/esm/components/drawer/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Drawer = exports.DrawerPosition = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _overlay = require("../overlay");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawerPosition = {
  TOP: 'top',
  BOTTOM: 'bottom',
  RIGHT: 'right',
  LEFT: 'left'
};
exports.DrawerPosition = DrawerPosition;

var Drawer =
/** @class */
function () {
  function Drawer() {}

  Drawer.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var position = attrs.position,
        content = attrs.content,
        className = attrs.class,
        style = attrs.style,
        otherAttrs = (0, _tslib.__rest)(attrs, ["position", "content", "class", "style"]);
    var innerContent = (0, _mithril.default)("." + _shared.Classes.DRAWER_CONTENT, content);
    var classes = (0, _classnames.default)(_shared.Classes.DRAWER, _shared.Classes.DRAWER + "-" + position, className);
    var container = (0, _mithril.default)('', {
      class: classes,
      style: style
    }, innerContent);
    return (0, _mithril.default)(_overlay.Overlay, (0, _tslib.__assign)((0, _tslib.__assign)({}, otherAttrs), {
      content: container
    }));
  };

  return Drawer;
}();

exports.Drawer = Drawer;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../overlay":"../node_modules/construct-ui/lib/esm/components/overlay/index.js"}],"../node_modules/construct-ui/lib/esm/components/empty-state/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmptyState = void 0;

var _tslib = require("tslib");

var _classnames = _interopRequireDefault(require("classnames"));

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

var _icon = require("../icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EmptyState =
/** @class */
function () {
  function EmptyState() {}

  EmptyState.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var className = attrs.class,
        _b = attrs.fill,
        fill = _b === void 0 ? true : _b,
        icon = attrs.icon,
        header = attrs.header,
        content = attrs.content,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "fill", "icon", "header", "content"]);
    var classes = (0, _classnames.default)(_shared.Classes.EMPTY_STATE, fill && _shared.Classes.EMPTY_STATE_FILL, className);
    var container = [icon && (0, _mithril.default)("." + _shared.Classes.EMPTY_STATE_ICON, [typeof icon === 'string' ? (0, _mithril.default)(_icon.Icon, {
      name: icon
    }) : icon]), header && (0, _mithril.default)("." + _shared.Classes.EMPTY_STATE_HEADER, header), content && (0, _mithril.default)("." + _shared.Classes.EMPTY_STATE_CONTENT, content)];
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes
    }), container);
  };

  return EmptyState;
}();

exports.EmptyState = EmptyState;
},{"tslib":"../node_modules/tslib/tslib.es6.js","classnames":"../node_modules/classnames/index.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js"}],"../node_modules/construct-ui/lib/esm/components/grid/Grid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grid = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_utils.ResponsiveManager.initialize();

var Grid =
/** @class */
function () {
  function Grid() {}

  Grid.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var align = attrs.align,
        className = attrs.class,
        element = attrs.element,
        justify = attrs.justify,
        gutter = attrs.gutter,
        style = attrs.style,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["align", "class", "element", "justify", "gutter", "style"]);
    var classes = (0, _classnames.default)(_shared.Classes.GRID, align && _shared.Classes.GRID + "-align-" + align, justify && _shared.Classes.GRID + "-justify-" + justify, className);
    var breakPointGutter = this.getGutter(attrs);
    var styles = (0, _tslib.__assign)((0, _tslib.__assign)({}, (0, _shared.normalizeStyle)(style)), {
      marginLeft: "-" + breakPointGutter / 2 + "px",
      marginRight: "-" + breakPointGutter / 2 + "px"
    });
    return (0, _mithril.default)(element || '', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes,
      style: styles
    }), this.renderCols(children, breakPointGutter));
  };

  Grid.prototype.getGutter = function (attrs) {
    var breakPoints = _utils.ResponsiveManager.activeBreakpoints;

    if (typeof attrs.gutter === 'object' && breakPoints) {
      var activeBreakpoints = Object.keys(breakPoints).filter(function (x) {
        return breakPoints[x];
      });
      var currentBreakpoint = activeBreakpoints[activeBreakpoints.length - 1];
      return attrs.gutter[currentBreakpoint] || 0;
    } else return attrs.gutter;
  };

  Grid.prototype.renderCols = function (children, gutter) {
    var _this = this;

    return children.map(function (col) {
      if (col == null || col.tag === '#') return;
      if (typeof col !== 'object') return col;

      if (col.tag === '[') {
        return _this.renderCols(col.children, gutter);
      }

      col.attrs = col.attrs || {};
      col.attrs.style = (0, _tslib.__assign)((0, _tslib.__assign)({}, (0, _shared.normalizeStyle)(col.attrs.style)), {
        paddingLeft: gutter / 2 + "px",
        paddingRight: gutter / 2 + "px"
      });
      return col;
    });
  };

  return Grid;
}();

exports.Grid = Grid;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../../utils":"../node_modules/construct-ui/lib/esm/utils/index.js"}],"../node_modules/construct-ui/lib/esm/components/grid/Col.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Col = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Col =
/** @class */
function () {
  function Col() {}

  Col.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var span = attrs.span,
        order = attrs.order,
        offset = attrs.offset,
        className = attrs.class,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["span", "order", "offset", "class"]);
    var breakpointClasses = '';
    Object.keys(_shared.Breakpoints).map(function (breakpoint) {
      breakpointClasses = (0, _classnames.default)(breakpointClasses, typeof span === 'object' && span[breakpoint] && _shared.Classes.COL + "-" + breakpoint + "-" + span[breakpoint], typeof order === 'object' && order[breakpoint] && _shared.Classes.COL + "-" + breakpoint + "-order-" + order[breakpoint], typeof offset === 'object' && offset[breakpoint] && _shared.Classes.COL + "-" + breakpoint + "-offset-" + offset[breakpoint]);
    });
    var classes = (0, _classnames.default)(breakpointClasses, typeof span === 'number' && _shared.Classes.COL + "-" + span, typeof order === 'number' && _shared.Classes.COL + "-order-" + order, typeof offset === 'number' && _shared.Classes.COL + "-offset-" + offset, className);
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes
    }), children);
  };

  return Col;
}();

exports.Col = Col;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/grid/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Grid = require("./Grid");

Object.keys(_Grid).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Grid[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Grid[key];
    }
  });
});

var _Col = require("./Col");

Object.keys(_Col).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Col[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Col[key];
    }
  });
});
},{"./Grid":"../node_modules/construct-ui/lib/esm/components/grid/Grid.js","./Col":"../node_modules/construct-ui/lib/esm/components/grid/Col.js"}],"../node_modules/construct-ui/lib/esm/components/form/Form.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _grid = require("../grid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Form =
/** @class */
function () {
  function Form() {}

  Form.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var classes = (0, _classnames.default)(_shared.Classes.FORM, attrs.class);
    return (0, _mithril.default)(_grid.Grid, (0, _tslib.__assign)((0, _tslib.__assign)({}, attrs), {
      element: 'form',
      class: classes
    }), children);
  };

  return Form;
}();

exports.Form = Form;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../grid":"../node_modules/construct-ui/lib/esm/components/grid/index.js"}],"../node_modules/construct-ui/lib/esm/components/form/FormLabel.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormLabel = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormLabel =
/** @class */
function () {
  function FormLabel() {}

  FormLabel.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    return (0, _mithril.default)("label." + _shared.Classes.FORM_LABEL, (0, _tslib.__assign)({}, attrs), children);
  };

  return FormLabel;
}();

exports.FormLabel = FormLabel;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/form/FormGroup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormGroup = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _FormLabel = require("./FormLabel");

var _grid = require("../grid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormGroup =
/** @class */
function () {
  function FormGroup() {}

  FormGroup.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var className = attrs.class,
        content = attrs.content,
        disabled = attrs.disabled,
        label = attrs.label,
        _b = attrs.span,
        span = _b === void 0 ? 12 : _b,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "content", "disabled", "label", "span"]);
    var classes = (0, _classnames.default)(_shared.Classes.FORM_GROUP, disabled && _shared.Classes.DISABLED, className);
    var innerContent = [label && (0, _mithril.default)(_FormLabel.FormLabel, label), content || children];
    return (0, _mithril.default)(_grid.Col, (0, _tslib.__assign)({
      class: classes,
      span: span
    }, htmlAttrs), innerContent);
  };

  return FormGroup;
}();

exports.FormGroup = FormGroup;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","./FormLabel":"../node_modules/construct-ui/lib/esm/components/form/FormLabel.js","../grid":"../node_modules/construct-ui/lib/esm/components/grid/index.js"}],"../node_modules/construct-ui/lib/esm/components/form/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Form = require("./Form");

Object.keys(_Form).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Form[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Form[key];
    }
  });
});

var _FormGroup = require("./FormGroup");

Object.keys(_FormGroup).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _FormGroup[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _FormGroup[key];
    }
  });
});

var _FormLabel = require("./FormLabel");

Object.keys(_FormLabel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _FormLabel[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _FormLabel[key];
    }
  });
});
},{"./Form":"../node_modules/construct-ui/lib/esm/components/form/Form.js","./FormGroup":"../node_modules/construct-ui/lib/esm/components/form/FormGroup.js","./FormLabel":"../node_modules/construct-ui/lib/esm/components/form/FormLabel.js"}],"../node_modules/construct-ui/lib/esm/components/input-file/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputFile = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ = require("../..");

var _button = require("../button");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputFile =
/** @class */
function () {
  function InputFile() {}

  InputFile.prototype.oncreate = function (vnode) {
    this.updatePadding(vnode);
  };

  InputFile.prototype.onupdate = function (vnode) {
    this.updatePadding(vnode);
  };

  InputFile.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var className = attrs.class,
        contentLeft = attrs.contentLeft,
        contentRight = attrs.contentRight,
        fluid = attrs.fluid,
        intent = attrs.intent,
        size = attrs.size,
        style = attrs.style,
        text = attrs.text,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "contentLeft", "contentRight", "fluid", "intent", "size", "style", "text"]);
    var classes = (0, _classnames.default)(_.Classes.INPUT_FILE, attrs.disabled && _.Classes.DISABLED, fluid && _.Classes.FLUID, intent && "cui-" + intent, size && "cui-" + size, className);
    this.browseButton = (0, _mithril.default)(_button.Button, {
      class: _.Classes.INPUT_FILE_BUTTON,
      label: 'Browse',
      tabindex: -1
    });
    var contentClasses = (0, _classnames.default)(_.Classes.INPUT_FILE_CONTENT, text && _.Classes.INPUT_FILE_TEXT);
    var content = [contentLeft, (0, _mithril.default)('input', (0, _tslib.__assign)((0, _tslib.__assign)({
      class: _.Classes.HIDDEN
    }, htmlAttrs), {
      type: 'file'
    })), (0, _mithril.default)('', {
      class: contentClasses
    }, text || 'Choose a file...'), contentRight || this.browseButton];
    return (0, _mithril.default)('label', {
      class: classes,
      style: style,
      tabindex: 0
    }, content);
  };

  InputFile.prototype.updatePadding = function (_a) {
    var attrs = _a.attrs,
        dom = _a.dom;
    var containerEl = dom.querySelector("." + _.Classes.INPUT_FILE_CONTENT);
    (0, _.updateElementGroupPadding)(containerEl, attrs.contentLeft, attrs.contentRight || this.browseButton);
  };

  return InputFile;
}();

exports.InputFile = InputFile;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../..":"../node_modules/construct-ui/lib/esm/index.js","../button":"../node_modules/construct-ui/lib/esm/components/button/index.js"}],"../node_modules/construct-ui/lib/esm/components/text-area/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextArea = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextArea =
/** @class */
function () {
  function TextArea() {}

  TextArea.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var basic = attrs.basic,
        className = attrs.class,
        disabled = attrs.disabled,
        fluid = attrs.fluid,
        intent = attrs.intent,
        size = attrs.size,
        style = attrs.style,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["basic", "class", "disabled", "fluid", "intent", "size", "style"]);
    var classes = (0, _classnames.default)(_shared.Classes.INPUT, _shared.Classes.TEXT_AREA, basic && _shared.Classes.BASIC, disabled && _shared.Classes.DISABLED, fluid && _shared.Classes.FLUID, intent && "cui-" + intent, size && "cui-" + size, className);
    return (0, _mithril.default)('', {
      class: classes,
      style: style
    }, (0, _mithril.default)('textarea', (0, _tslib.__assign)({}, htmlAttrs)));
  };

  return TextArea;
}();

exports.TextArea = TextArea;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/input-popover/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputPopover = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _abstractComponent = require("../abstract-component");

var _input = require("../input");

var _button = require("../button");

var _popover = require("../popover");

var _textArea = require("../text-area");

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HIGHLIGHT_TIMEOUT = 25;

var InputPopover =
/** @class */
function (_super) {
  (0, _tslib.__extends)(InputPopover, _super);

  function InputPopover() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.handleOnKeyDown = function (e) {
      var _a = _this.attrs,
          type = _a.type,
          submitOnEnter = _a.submitOnEnter;

      if (e.which === _shared.Keys.ENTER && type === 'input' && submitOnEnter) {
        var contentEl = (0, _shared.getClosest)(e.target, "." + _shared.Classes.INPUT_POPOVER_CONTENT);
        var submitBtnEl = contentEl.querySelector("." + _shared.Classes.POPOVER_DISSMISS);
        submitBtnEl.click();

        _mithril.default.redraw();
      }

      e.redraw = false;
    };

    _this.handleOnSubmit = function (e) {
      var submitButtonAttrs = _this.attrs.submitButtonAttrs;

      _this.attrs.onSubmit(_this.value);

      (0, _shared.safeCall)(submitButtonAttrs.onclick, e);
    };

    _this.handleOnOpened = function (content) {
      var _a = _this.attrs,
          type = _a.type,
          hightlightOnOpen = _a.hightlightOnOpen,
          onOpened = _a.onOpened;
      var inputEl = content.querySelector(type);
      _this.value = _this.attrs.value || '';

      if (hightlightOnOpen) {
        setTimeout(function () {
          return inputEl.select();
        }, HIGHLIGHT_TIMEOUT);
      }

      (0, _shared.safeCall)(onOpened);
    };

    _this.handleOnClosed = function () {
      var onClosed = _this.attrs.onClosed;
      _this.value = '';
      (0, _shared.safeCall)(onClosed);
    };

    return _this;
  }

  InputPopover.prototype.getDefaultAttrs = function () {
    return {
      contentAttrs: {},
      inputAttrs: {},
      submitButtonAttrs: {},
      submitButtonLabel: 'Submit',
      type: 'input'
    };
  };

  InputPopover.prototype.oninit = function (vnode) {
    _super.prototype.oninit.call(this, vnode);

    this.value = vnode.attrs.value || '';
  };

  InputPopover.prototype.view = function () {
    var _a = this.attrs,
        className = _a.class,
        value = _a.value,
        header = _a.header,
        contentAttrs = _a.contentAttrs,
        footer = _a.footer,
        inputAttrs = _a.inputAttrs,
        onSubmit = _a.onSubmit,
        submitButtonAttrs = _a.submitButtonAttrs,
        submitButtonLabel = _a.submitButtonLabel,
        placeholder = _a.placeholder,
        type = _a.type,
        popoverAttrs = (0, _tslib.__rest)(_a, ["class", "value", "header", "contentAttrs", "footer", "inputAttrs", "onSubmit", "submitButtonAttrs", "submitButtonLabel", "placeholder", "type"]);
    return (0, _mithril.default)(_popover.Popover, (0, _tslib.__assign)((0, _tslib.__assign)({
      class: (0, _classnames.default)(_shared.Classes.INPUT_POPOVER, className),
      autofocus: true
    }, popoverAttrs), {
      content: (0, _mithril.default)("." + _shared.Classes.INPUT_POPOVER_CONTENT, (0, _tslib.__assign)((0, _tslib.__assign)({}, contentAttrs), {
        onkeydown: this.handleOnKeyDown
      }), [header, this.renderInput(), (0, _mithril.default)(_button.Button, (0, _tslib.__assign)({
        class: _shared.Classes.POPOVER_DISSMISS,
        fluid: true,
        intent: 'primary',
        label: submitButtonLabel,
        onclick: this.handleOnSubmit
      }, submitButtonAttrs)), footer]),
      onClosed: this.handleOnClosed,
      onOpened: this.handleOnOpened
    }));
  };

  InputPopover.prototype.renderInput = function () {
    var _this = this;

    var _a = this.attrs,
        type = _a.type,
        inputAttrs = _a.inputAttrs,
        placeholder = _a.placeholder;
    var component = type === 'textarea' ? _textArea.TextArea : _input.Input;
    return (0, _mithril.default)(component, (0, _tslib.__assign)({
      autofocus: true,
      rows: 5,
      fluid: true,
      value: this.value,
      onkeyup: function (e) {
        return _this.value = e.target.value;
      },
      placeholder: placeholder
    }, inputAttrs));
  };

  return InputPopover;
}(_abstractComponent.AbstractComponent);

exports.InputPopover = InputPopover;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js","../input":"../node_modules/construct-ui/lib/esm/components/input/index.js","../button":"../node_modules/construct-ui/lib/esm/components/button/index.js","../popover":"../node_modules/construct-ui/lib/esm/components/popover/index.js","../text-area":"../node_modules/construct-ui/lib/esm/components/text-area/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/input-select/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputSelect = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _lodash = _interopRequireDefault(require("lodash.debounce"));

var _abstractComponent = require("../abstract-component");

var _queryList = require("../query-list");

var _popover = require("../popover");

var _input = require("../input");

var _spinner = require("../spinner");

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputSelect =
/** @class */
function (_super) {
  (0, _tslib.__extends)(InputSelect, _super);

  function InputSelect() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.queryList = _queryList.QueryList.ofType();
    _this.query = '';
    _this.activeIndex = 0;

    _this.handleInput = function (e) {
      _this.handleSearchDebounce(e);

      e.redraw = false;
    };

    _this.handleInputFocus = function (e) {
      _this.isOpen = true;
      (0, _shared.safeCall)(_this.attrs.inputAttrs.onfocus, e);
    };

    _this.handleInputKeyDown = function (e) {
      if (e.which === _shared.Keys.ARROW_DOWN && _this.attrs.openOnDownKey) {
        _this.isOpen = true;

        _mithril.default.redraw();
      } else if (e.which === _shared.Keys.TAB || e.which === _shared.Keys.ESCAPE) {
        _this.isOpen = false;

        _mithril.default.redraw();
      }

      if (_this.isOpen) {
        _this.handleQueryListKeyDown(e);
      }

      (0, _shared.safeCall)(_this.attrs.inputAttrs.onkeydown, e);
      e.redraw = false;
    };

    _this.handleSearchDebounce = (0, _lodash.default)(function (e) {
      var value = e.target.value;
      _this.query = value;
      _this.activeIndex = 0;
      (0, _shared.safeCall)(_this.attrs.inputAttrs.oninput, e);

      _mithril.default.redraw();
    }, 200);

    _this.handleActiveItemChange = function (activeItem, index) {
      _this.activeIndex = index;
      (0, _shared.safeCall)(_this.attrs.onActiveItemChange, activeItem, index);
    };

    _this.handleSelect = function (item, e) {
      var _a = _this.attrs,
          onSelect = _a.onSelect,
          closeOnSelect = _a.closeOnSelect;

      if (closeOnSelect) {
        _this.isOpen = false;

        _this.inputEl.blur();
      } else {
        _this.inputEl.focus();
      }

      (0, _shared.safeCall)(onSelect, item, e);
    };

    _this.handlePopoverInteraction = function (nextOpenState, e) {
      var isClickOnInput = (0, _shared.getClosest)(e.target, "." + _shared.Classes.INPUT);

      if (!isClickOnInput) {
        _this.isOpen = false;
      }

      (0, _shared.safeCall)(_this.attrs.popoverAttrs, nextOpenState, e);
    };

    _this.handlePopoverClosed = function () {
      _this.query = '';
      (0, _shared.safeCall)(_this.attrs.popoverAttrs.onClosed);
    };

    return _this;
  }

  InputSelect.prototype.getDefaultAttrs = function () {
    return {
      closeOnSelect: true,
      popoverAttrs: {},
      inputAttrs: {},
      openOnDownKey: true
    };
  };

  InputSelect.ofType = function () {
    return InputSelect;
  };

  InputSelect.prototype.oninit = function (vnode) {
    _super.prototype.oninit.call(this, vnode);

    var _a = vnode.attrs.popoverAttrs,
        isOpen = _a.isOpen,
        defaultIsOpen = _a.defaultIsOpen;
    this.isOpen = isOpen != null ? isOpen : defaultIsOpen != null ? defaultIsOpen : false;
  };

  InputSelect.prototype.onbeforeupdate = function (vnode, old) {
    _super.prototype.onbeforeupdate.call(this, vnode, old);

    var isOpen = vnode.attrs.popoverAttrs.isOpen;
    var wasOpen = old.attrs.popoverAttrs.isOpen;

    if (isOpen && !wasOpen) {
      this.isOpen = true;
    } else if (!isOpen && wasOpen) {
      this.isOpen = false;
    }
  };

  InputSelect.prototype.view = function () {
    var _this = this;

    var _a = this.attrs,
        className = _a.class,
        popoverAttrs = _a.popoverAttrs,
        header = _a.header,
        footer = _a.footer,
        closeOnSelect = _a.closeOnSelect,
        loading = _a.loading,
        inputAttrs = _a.inputAttrs,
        value = _a.value,
        openOnDownKey = _a.openOnDownKey,
        queryListAttrs = (0, _tslib.__rest)(_a, ["class", "popoverAttrs", "header", "footer", "closeOnSelect", "loading", "inputAttrs", "value", "openOnDownKey"]);
    var queryList = (0, _mithril.default)(this.queryList, (0, _tslib.__assign)((0, _tslib.__assign)({}, queryListAttrs), {
      activeIndex: this.activeIndex,
      onActiveItemChange: this.handleActiveItemChange,
      eventCallbacks: function (events) {
        return _this.handleQueryListKeyDown = events.handleKeyDown;
      },
      filterable: false,
      query: this.query,
      onSelect: this.handleSelect
    }));
    this.input = (0, _mithril.default)(_input.Input, (0, _tslib.__assign)((0, _tslib.__assign)({}, inputAttrs), {
      oninput: this.handleInput,
      onkeydown: this.handleInputKeyDown,
      value: this.isOpen ? this.query : value,
      onfocus: this.handleInputFocus,
      placeholder: this.isOpen ? value : ''
    }));
    var content = [header, (0, _mithril.default)(_spinner.Spinner, {
      active: loading,
      background: true,
      fill: true
    }), queryList, footer];
    return (0, _mithril.default)(_popover.Popover, (0, _tslib.__assign)((0, _tslib.__assign)({
      position: 'bottom-start',
      closeOnEscapeKey: false
    }, popoverAttrs), {
      autofocus: false,
      restoreFocus: false,
      closeOnOutsideClick: false,
      class: (0, _classnames.default)(_shared.Classes.INPUT_SELECT, className),
      isOpen: this.isOpen,
      content: content,
      onClosed: this.handlePopoverClosed,
      onInteraction: this.handlePopoverInteraction,
      trigger: this.input
    }));
  };

  Object.defineProperty(InputSelect.prototype, "inputEl", {
    get: function () {
      return this.input.dom && this.input.dom.querySelector('input');
    },
    enumerable: false,
    configurable: true
  });
  return InputSelect;
}(_abstractComponent.AbstractComponent);

exports.InputSelect = InputSelect;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","lodash.debounce":"../node_modules/lodash.debounce/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js","../query-list":"../node_modules/construct-ui/lib/esm/components/query-list/index.js","../popover":"../node_modules/construct-ui/lib/esm/components/popover/index.js","../input":"../node_modules/construct-ui/lib/esm/components/input/index.js","../spinner":"../node_modules/construct-ui/lib/esm/components/spinner/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/menu/Menu.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Menu = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Menu =
/** @class */
function () {
  function Menu() {}

  Menu.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var basic = attrs.basic,
        className = attrs.class,
        size = attrs.size,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["basic", "class", "size"]);
    var classes = (0, _classnames.default)(_shared.Classes.MENU, basic && _shared.Classes.BASIC, size && "cui-" + size, className);
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes
    }), children);
  };

  return Menu;
}();

exports.Menu = Menu;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/menu/MenuDivider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuDivider = void 0;

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MenuDivider =
/** @class */
function () {
  function MenuDivider() {}

  MenuDivider.prototype.view = function () {
    return (0, _mithril.default)("." + _shared.Classes.MENU_DIVIDER);
  };

  return MenuDivider;
}();

exports.MenuDivider = MenuDivider;
},{"mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/popover-menu/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopoverMenu = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ = require("../../");

var _popover = require("../popover");

var _menu = require("../menu");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PopoverMenu =
/** @class */
function () {
  function PopoverMenu() {}

  PopoverMenu.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var className = attrs.class,
        menuAttrs = attrs.menuAttrs,
        content = attrs.content,
        popoverAttrs = (0, _tslib.__rest)(attrs, ["class", "menuAttrs", "content"]);
    return (0, _mithril.default)(_popover.Popover, (0, _tslib.__assign)((0, _tslib.__assign)({}, popoverAttrs), {
      class: (0, _classnames.default)(_.Classes.POPOVER_MENU, className),
      content: (0, _mithril.default)(_menu.Menu, (0, _tslib.__assign)({}, menuAttrs), content)
    }));
  };

  return PopoverMenu;
}();

exports.PopoverMenu = PopoverMenu;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../":"../node_modules/construct-ui/lib/esm/index.js","../popover":"../node_modules/construct-ui/lib/esm/components/popover/index.js","../menu":"../node_modules/construct-ui/lib/esm/components/menu/index.js"}],"../node_modules/construct-ui/lib/esm/components/menu/MenuItem.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuItem = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _button = require("../button");

var _popoverMenu = require("../popover-menu");

var _icon = require("../icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MenuItem =
/** @class */
function () {
  function MenuItem() {}

  MenuItem.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var className = attrs.class,
        submenu = attrs.submenu,
        closeOnSubmenuClick = attrs.closeOnSubmenuClick,
        popoverMenuAttrs = attrs.popoverMenuAttrs,
        buttonAttrs = (0, _tslib.__rest)(attrs, ["class", "submenu", "closeOnSubmenuClick", "popoverMenuAttrs"]);
    var classes = (0, _classnames.default)(_shared.Classes.MENU_ITEM, _shared.Classes.BASIC, className);
    var button = (0, _mithril.default)(_button.Button, (0, _tslib.__assign)((0, _tslib.__assign)({
      align: 'left',
      compact: true,
      iconRight: submenu ? _icon.Icons.CHEVRON_RIGHT : undefined
    }, buttonAttrs), {
      class: classes
    }));
    return submenu ? (0, _mithril.default)(_popoverMenu.PopoverMenu, (0, _tslib.__assign)((0, _tslib.__assign)({
      hasArrow: false,
      interactionType: 'hover',
      openOnTriggerFocus: true,
      position: 'right-start'
    }, popoverMenuAttrs), {
      closeOnContentClick: closeOnSubmenuClick,
      addToStack: false,
      content: submenu,
      inline: true,
      restoreFocus: false,
      trigger: button
    })) : button;
  };

  return MenuItem;
}();

exports.MenuItem = MenuItem;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../button":"../node_modules/construct-ui/lib/esm/components/button/index.js","../popover-menu":"../node_modules/construct-ui/lib/esm/components/popover-menu/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js"}],"../node_modules/construct-ui/lib/esm/components/menu/MenuHeading.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuHeading = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MenuHeading =
/** @class */
function () {
  function MenuHeading() {}

  MenuHeading.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var className = attrs.class,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class"]);
    return (0, _mithril.default)('', (0, _tslib.__assign)({
      class: (0, _classnames.default)(_shared.Classes.MENU_HEADING, className)
    }, htmlAttrs), children);
  };

  return MenuHeading;
}();

exports.MenuHeading = MenuHeading;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/menu/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Menu = require("./Menu");

Object.keys(_Menu).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Menu[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Menu[key];
    }
  });
});

var _MenuDivider = require("./MenuDivider");

Object.keys(_MenuDivider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _MenuDivider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _MenuDivider[key];
    }
  });
});

var _MenuItem = require("./MenuItem");

Object.keys(_MenuItem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _MenuItem[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _MenuItem[key];
    }
  });
});

var _MenuHeading = require("./MenuHeading");

Object.keys(_MenuHeading).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _MenuHeading[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _MenuHeading[key];
    }
  });
});
},{"./Menu":"../node_modules/construct-ui/lib/esm/components/menu/Menu.js","./MenuDivider":"../node_modules/construct-ui/lib/esm/components/menu/MenuDivider.js","./MenuItem":"../node_modules/construct-ui/lib/esm/components/menu/MenuItem.js","./MenuHeading":"../node_modules/construct-ui/lib/esm/components/menu/MenuHeading.js"}],"../node_modules/construct-ui/lib/esm/components/radio/Radio.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Radio = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

var _baseControl = require("../base-control");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Radio =
/** @class */
function () {
  function Radio() {}

  Radio.prototype.view = function (_a) {
    var attrs = _a.attrs;
    return (0, _mithril.default)(_baseControl.BaseControl, (0, _tslib.__assign)((0, _tslib.__assign)({}, attrs), {
      type: 'radio',
      typeClass: _shared.Classes.RADIO
    }));
  };

  return Radio;
}();

exports.Radio = Radio;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../base-control":"../node_modules/construct-ui/lib/esm/components/base-control/index.js"}],"../node_modules/construct-ui/lib/esm/components/radio/RadioGroup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioGroup = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _Radio = require("./Radio");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instanceCounter = 0;

var RadioGroup =
/** @class */
function () {
  function RadioGroup() {
    this.uniqueId = _shared.Classes.RADIO_GROUP + "-" + instanceCounter++;
  }

  RadioGroup.prototype.view = function (_a) {
    var _this = this;

    var attrs = _a.attrs;
    var className = attrs.class,
        disabled = attrs.disabled,
        intent = attrs.intent,
        name = attrs.name,
        options = attrs.options,
        onchange = attrs.onchange,
        size = attrs.size,
        value = attrs.value,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "disabled", "intent", "name", "options", "onchange", "size", "value"]);
    var classes = (0, _classnames.default)(_shared.Classes.RADIO_GROUP, size && "cui-" + size, className);
    var radioButtons = attrs.options.map(function (option) {
      return _this.renderRadioButton(option, attrs);
    });
    return (0, _mithril.default)('', (0, _tslib.__assign)({
      class: classes
    }, htmlAttrs), radioButtons);
  };

  RadioGroup.prototype.renderRadioButton = function (option, attrs) {
    var label = typeof option === 'object' ? option.label : option;
    var value = typeof option === 'object' ? option.value : option;
    return (0, _mithril.default)(_Radio.Radio, {
      checked: value === attrs.value,
      disabled: attrs.disabled,
      label: label,
      name: attrs.name || this.uniqueId,
      onchange: attrs.onchange,
      value: value
    });
  };

  return RadioGroup;
}();

exports.RadioGroup = RadioGroup;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","./Radio":"../node_modules/construct-ui/lib/esm/components/radio/Radio.js"}],"../node_modules/construct-ui/lib/esm/components/radio/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Radio = require("./Radio");

Object.keys(_Radio).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Radio[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Radio[key];
    }
  });
});

var _RadioGroup = require("./RadioGroup");

Object.keys(_RadioGroup).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _RadioGroup[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _RadioGroup[key];
    }
  });
});
},{"./Radio":"../node_modules/construct-ui/lib/esm/components/radio/Radio.js","./RadioGroup":"../node_modules/construct-ui/lib/esm/components/radio/RadioGroup.js"}],"../node_modules/construct-ui/lib/esm/components/select/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Select = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _icon = require("../icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Select =
/** @class */
function () {
  function Select() {}

  Select.prototype.oncreate = function (vnode) {
    this.updatePadding(vnode);
  };

  Select.prototype.onupdate = function (vnode) {
    this.updatePadding(vnode);
  };

  Select.prototype.view = function (_a) {
    var _this = this;

    var attrs = _a.attrs;
    var basic = attrs.basic,
        className = attrs.class,
        defaultValue = attrs.defaultValue,
        contentLeft = attrs.contentLeft,
        contentRight = attrs.contentRight,
        fluid = attrs.fluid,
        intent = attrs.intent,
        _b = attrs.options,
        options = _b === void 0 ? [] : _b,
        size = attrs.size,
        style = attrs.style,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["basic", "class", "defaultValue", "contentLeft", "contentRight", "fluid", "intent", "options", "size", "style"]);
    var classes = (0, _classnames.default)(_shared.Classes.SELECT, basic && _shared.Classes.BASIC, htmlAttrs.disabled && _shared.Classes.DISABLED, fluid && _shared.Classes.FLUID, intent && "cui-" + intent, size && "cui-" + size, className);
    var selectOptions = options.map(function (option) {
      return _this.renderOption(option, attrs);
    });
    return (0, _mithril.default)('', {
      class: classes,
      style: style
    }, [contentLeft, (0, _mithril.default)('select', (0, _tslib.__assign)({}, htmlAttrs), selectOptions), contentRight || (0, _mithril.default)(_icon.Icon, {
      name: _icon.Icons.CHEVRON_DOWN
    })]);
  };

  Select.prototype.renderOption = function (option, _a) {
    var defaultValue = _a.defaultValue;
    var label = typeof option === 'object' ? option.label : option;
    var value = typeof option === 'object' ? option.value : option;
    var attrs = typeof option === 'object' ? option : {};
    return (0, _mithril.default)('option', (0, _tslib.__assign)((0, _tslib.__assign)({}, attrs), {
      selected: defaultValue != null && value === defaultValue,
      value: value
    }), label);
  };

  Select.prototype.updatePadding = function (_a) {
    var attrs = _a.attrs,
        dom = _a.dom;
    var containerEl = dom.querySelector('select');
    (0, _shared.updateElementGroupPadding)(containerEl, attrs.contentLeft, attrs.contentRight);
  };

  return Select;
}();

exports.Select = Select;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js"}],"../node_modules/construct-ui/lib/esm/components/switch/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Switch = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

var _baseControl = require("../base-control");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Switch =
/** @class */
function () {
  function Switch() {}

  Switch.prototype.view = function (_a) {
    var attrs = _a.attrs;
    return (0, _mithril.default)(_baseControl.BaseControl, (0, _tslib.__assign)((0, _tslib.__assign)({}, attrs), {
      type: 'checkbox',
      typeClass: _shared.Classes.SWITCH
    }));
  };

  return Switch;
}();

exports.Switch = Switch;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../base-control":"../node_modules/construct-ui/lib/esm/components/base-control/index.js"}],"../node_modules/construct-ui/lib/esm/components/table/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Table = void 0;

var _tslib = require("tslib");

var _classnames = _interopRequireDefault(require("classnames"));

var _mithril = _interopRequireDefault(require("mithril"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Table =
/** @class */
function () {
  function Table() {}

  Table.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var className = attrs.class,
        bordered = attrs.bordered,
        interactive = attrs.interactive,
        striped = attrs.striped,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "bordered", "interactive", "striped"]);
    return (0, _mithril.default)('table', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: (0, _classnames.default)(_shared.Classes.TABLE, bordered && _shared.Classes.TABLE_BORDERED, striped && _shared.Classes.TABLE_STRIPED, interactive && _shared.Classes.TABLE_INTERACTIVE, className)
    }), children);
  };

  return Table;
}();

exports.Table = Table;
},{"tslib":"../node_modules/tslib/tslib.es6.js","classnames":"../node_modules/classnames/index.js","mithril":"../node_modules/mithril/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/tabs/Tabs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tabs = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tabs =
/** @class */
function () {
  function Tabs() {}

  Tabs.prototype.view = function (_a) {
    var attrs = _a.attrs,
        children = _a.children;
    var align = attrs.align,
        bordered = attrs.bordered,
        fluid = attrs.fluid,
        size = attrs.size,
        classname = attrs.class,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["align", "bordered", "fluid", "size", "class"]);
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: (0, _classnames.default)(_shared.Classes.TABS, align && "cui-align-" + align, bordered && _shared.Classes.TABS_BORDERED, fluid && _shared.Classes.FLUID, size && "cui-" + size, classname)
    }), children);
  };

  return Tabs;
}();

exports.Tabs = Tabs;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/tabs/TabsItem.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabItem = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _spinner = require("../spinner");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TabItem =
/** @class */
function () {
  function TabItem() {}

  TabItem.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var active = attrs.active,
        label = attrs.label,
        loading = attrs.loading,
        size = attrs.size,
        className = attrs.class,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["active", "label", "loading", "size", "class"]);
    var classes = (0, _classnames.default)(_shared.Classes.TABS_ITEM, active && _shared.Classes.ACTIVE, loading && _shared.Classes.LOADING, size && "cui-" + size, className);
    var content = [loading && (0, _mithril.default)(_spinner.Spinner, {
      active: true,
      fill: true
    }), label];
    return (0, _mithril.default)('', (0, _tslib.__assign)({
      class: classes
    }, htmlAttrs), content);
  };

  return TabItem;
}();

exports.TabItem = TabItem;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../spinner":"../node_modules/construct-ui/lib/esm/components/spinner/index.js"}],"../node_modules/construct-ui/lib/esm/components/tabs/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Tabs = require("./Tabs");

Object.keys(_Tabs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Tabs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Tabs[key];
    }
  });
});

var _TabsItem = require("./TabsItem");

Object.keys(_TabsItem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _TabsItem[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _TabsItem[key];
    }
  });
});
},{"./Tabs":"../node_modules/construct-ui/lib/esm/components/tabs/Tabs.js","./TabsItem":"../node_modules/construct-ui/lib/esm/components/tabs/TabsItem.js"}],"../node_modules/construct-ui/lib/esm/components/tag/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tag = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _icon = require("../icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tag =
/** @class */
function () {
  function Tag() {}

  Tag.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var className = attrs.class,
        label = attrs.label,
        intent = attrs.intent,
        size = attrs.size,
        rounded = attrs.rounded,
        onRemove = attrs.onRemove,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["class", "label", "intent", "size", "rounded", "onRemove"]);
    var classes = (0, _classnames.default)(_shared.Classes.TAG, intent && "cui-" + intent, rounded && _shared.Classes.ROUNDED, onRemove && _shared.Classes.TAG_REMOVABLE, size && "cui-" + size, className);
    var content = [label, onRemove && (0, _mithril.default)(_icon.Icon, {
      name: _icon.Icons.X,
      onclick: onRemove
    })];
    return (0, _mithril.default)('span', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes
    }), content);
  };

  return Tag;
}();

exports.Tag = Tag;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js"}],"../node_modules/construct-ui/lib/esm/components/tag-input/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagInput = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _abstractComponent = require("../abstract-component");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TagInput =
/** @class */
function (_super) {
  (0, _tslib.__extends)(TagInput, _super);

  function TagInput() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.handleContentClick = function (e) {
      var disabled = _this.attrs.disabled;

      if (disabled) {
        return;
      }

      if (_this.inputEl) {
        _this.inputEl.focus();
      }

      (0, _shared.safeCall)(_this.attrs.onclick, e);
    };

    _this.handleInputKeyDown = function (e) {
      if (e.which === _shared.Keys.ENTER) {
        _this.handleOnAdd(e);
      }

      (0, _shared.safeCall)(_this.attrs.inputAttrs.onkeydown, e);
    };

    _this.handleInputFocus = function (e) {
      _this.isActive = true;
      (0, _shared.safeCall)(_this.attrs.inputAttrs.onfocus, e);
    };

    _this.handleInputBlur = function (e) {
      var _a = _this.attrs,
          addOnBlur = _a.addOnBlur,
          inputAttrs = _a.inputAttrs;
      _this.isActive = false;

      if (addOnBlur) {
        _this.handleOnAdd(e);
      }

      (0, _shared.safeCall)(inputAttrs.onblur, e);
    };

    return _this;
  }

  TagInput.prototype.getDefaultAttrs = function () {
    return {
      tags: [],
      inputAttrs: {}
    };
  };

  TagInput.prototype.oncreate = function (_a) {
    var dom = _a.dom;
    this.inputEl = dom.querySelector('input');
  };

  TagInput.prototype.view = function () {
    var _a = this.attrs,
        className = _a.class,
        contentLeft = _a.contentLeft,
        contentRight = _a.contentRight,
        disabled = _a.disabled,
        fluid = _a.fluid,
        intent = _a.intent,
        inputAttrs = _a.inputAttrs,
        size = _a.size,
        tags = _a.tags,
        htmlAttrs = (0, _tslib.__rest)(_a, ["class", "contentLeft", "contentRight", "disabled", "fluid", "intent", "inputAttrs", "size", "tags"]);
    var classes = (0, _classnames.default)(_shared.Classes.TAG_INPUT, this.isActive && _shared.Classes.ACTIVE, disabled && _shared.Classes.DISABLED, fluid && _shared.Classes.FLUID, intent && "cui-" + intent, size && "cui-" + size, className);
    var input = (0, _mithril.default)('input', (0, _tslib.__assign)((0, _tslib.__assign)({
      disabled: disabled
    }, inputAttrs), {
      onfocus: this.handleInputFocus,
      onblur: this.handleInputBlur,
      onkeydown: this.handleInputKeyDown
    }));
    var content = [contentLeft, (0, _mithril.default)("." + _shared.Classes.TAG_INPUT_VALUES, tags, input), contentRight];
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: classes,
      onclick: this.handleContentClick
    }), content);
  };

  TagInput.prototype.handleOnAdd = function (e) {
    var value = this.inputEl.value;

    if (value) {
      (0, _shared.safeCall)(this.attrs.onAdd, this.inputEl.value, e);
      this.inputEl.value = '';
    }
  };

  return TagInput;
}(_abstractComponent.AbstractComponent);

exports.TagInput = TagInput;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js"}],"../node_modules/construct-ui/lib/esm/components/toast/Toast.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toast = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _abstractComponent = require("../abstract-component");

var _icon = require("../icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Toast =
/** @class */
function (_super) {
  (0, _tslib.__extends)(Toast, _super);

  function Toast() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.handleCloseClick = function () {
      _this.triggerDismiss(false);
    };

    _this.startTimeout = function () {
      var timeout = _this.attrs.timeout;

      if (timeout > 0) {
        _this.setTimeout(function () {
          return _this.triggerDismiss(true);
        }, timeout);
      }
    };

    return _this;
  }

  Toast.prototype.getDefaultAttrs = function () {
    return {
      timeout: 3000
    };
  };

  Toast.prototype.oncreate = function () {
    this.startTimeout();
  };

  Toast.prototype.onbeforeupdate = function (vnode, prev) {
    _super.prototype.onbeforeupdate.call(this, vnode, prev);

    if (prev.attrs.timeout <= 0 && vnode.attrs.timeout > 0) {
      this.startTimeout();
    } else if (prev.attrs.timeout > 0 && vnode.attrs.timeout <= 0) {
      this.clearTimeouts();
    } else if (vnode.attrs.timeout !== prev.attrs.timeout) {
      this.clearTimeouts();
      this.startTimeout();
    }
  };

  Toast.prototype.view = function () {
    var _a = this.attrs,
        className = _a.class,
        intent = _a.intent,
        size = _a.size,
        icon = _a.icon,
        message = _a.message,
        htmlAttrs = (0, _tslib.__rest)(_a, ["class", "intent", "size", "icon", "message"]);
    var classes = (0, _classnames.default)(_shared.Classes.TOAST, intent && "cui-" + intent, size && "cui-" + size, className);
    var content = [icon && (0, _mithril.default)(_icon.Icon, {
      name: icon
    }), (0, _mithril.default)("." + _shared.Classes.TOAST_MESSAGE, message), (0, _mithril.default)(_icon.Icon, {
      name: _icon.Icons.X,
      onclick: this.handleCloseClick
    })];
    return (0, _mithril.default)('', (0, _tslib.__assign)((0, _tslib.__assign)({
      class: classes,
      onblur: this.startTimeout,
      onfocus: this.clearTimeouts,
      onmouseenter: this.clearTimeouts,
      onmouseleave: this.startTimeout
    }, htmlAttrs), {
      tabindex: 0
    }), content);
  };

  Toast.prototype.onremove = function () {
    this.clearTimeouts();
  };

  Toast.prototype.triggerDismiss = function (didTimeoutExpire) {
    (0, _shared.safeCall)(this.attrs.onDismiss, this.attrs.key, didTimeoutExpire);
    this.clearTimeouts();

    _mithril.default.redraw();
  };

  return Toast;
}(_abstractComponent.AbstractComponent);

exports.Toast = Toast;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js"}],"../node_modules/construct-ui/lib/esm/components/toast/Toaster.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toaster = exports.ToasterPosition = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _abstractComponent = require("../abstract-component");

var _Toast = require("./Toast");

var _overlay = require("../overlay");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ToasterPosition = {
  TOP: 'top',
  TOP_START: 'top-start',
  TOP_END: 'top-end',
  BOTTOM: 'bottom',
  BOTTOM_START: 'bottom-start',
  BOTTOM_END: 'bottom-end'
};
exports.ToasterPosition = ToasterPosition;

var Toaster =
/** @class */
function (_super) {
  (0, _tslib.__extends)(Toaster, _super);

  function Toaster() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.toasts = [];
    _this.toastId = 0;

    _this.dismiss = function (key, timedOut) {
      if (timedOut === void 0) {
        timedOut = false;
      }

      var index = _this.toasts.findIndex(function (x) {
        return x.key === key;
      });

      var toast = _this.toasts[index];

      if (toast) {
        (0, _shared.safeCall)(toast.onDismiss, timedOut);

        _this.toasts.splice(index, 1);
      }

      _mithril.default.redraw();
    };

    return _this;
  }

  Toaster.prototype.getDefaultAttrs = function () {
    return {
      clearOnEscapeKey: true,
      position: 'top'
    };
  };

  Toaster.prototype.view = function () {
    var _this = this;

    var _a = this.attrs,
        className = _a.class,
        position = _a.position,
        inline = _a.inline,
        toasts = _a.toasts,
        clearOnEscapeKey = _a.clearOnEscapeKey,
        style = _a.style;
    var classes = (0, _classnames.default)(_shared.Classes.TOASTER, _shared.Classes.TOASTER + "-" + position, inline && _shared.Classes.TOASTER_INLINE, className);
    var renderedToasts = this.isControlled() ? toasts || [] : this.toasts.map(function (toastOptions) {
      return _this.renderToast(toastOptions);
    });
    return (0, _mithril.default)(_overlay.Overlay, {
      closeOnEscapeKey: clearOnEscapeKey,
      closeOnOutsideClick: false,
      class: classes,
      content: renderedToasts,
      hasBackdrop: false,
      inline: inline,
      isOpen: renderedToasts.length > 0,
      transitionDuration: 0,
      addToStack: false,
      onClose: function () {
        return _this.clear();
      },
      style: style
    });
  };

  Toaster.prototype.onremove = function () {
    this.clear();
  };

  Toaster.prototype.show = function (attrs) {
    var toastOptions = (0, _tslib.__assign)((0, _tslib.__assign)({}, attrs), {
      key: "cui-toast-" + this.toastId++
    });
    this.toasts.push(toastOptions);

    _mithril.default.redraw();

    return toastOptions.key;
  };

  Toaster.prototype.update = function (key, attrs) {
    var index = this.toasts.findIndex(function (x) {
      return x.key === key;
    });
    this.toasts[index] = (0, _tslib.__assign)((0, _tslib.__assign)({}, this.toasts[index]), attrs);

    _mithril.default.redraw();
  };

  Toaster.prototype.clear = function () {
    this.toasts.map(function (x) {
      return (0, _shared.safeCall)(x.onDismiss, false);
    });
    this.toasts.length = 0;

    _mithril.default.redraw();
  };

  Toaster.prototype.getToasts = function () {
    return this.toasts;
  };

  Toaster.prototype.renderToast = function (attrs) {
    return (0, _mithril.default)(_Toast.Toast, (0, _tslib.__assign)((0, _tslib.__assign)({}, attrs), {
      onDismiss: this.dismiss
    }));
  };

  Toaster.prototype.isControlled = function () {
    return this.attrs.toasts != null;
  };

  return Toaster;
}(_abstractComponent.AbstractComponent);

exports.Toaster = Toaster;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../abstract-component":"../node_modules/construct-ui/lib/esm/components/abstract-component/index.js","./Toast":"../node_modules/construct-ui/lib/esm/components/toast/Toast.js","../overlay":"../node_modules/construct-ui/lib/esm/components/overlay/index.js"}],"../node_modules/construct-ui/lib/esm/components/toast/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Toast = require("./Toast");

Object.keys(_Toast).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Toast[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Toast[key];
    }
  });
});

var _Toaster = require("./Toaster");

Object.keys(_Toaster).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Toaster[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Toaster[key];
    }
  });
});
},{"./Toast":"../node_modules/construct-ui/lib/esm/components/toast/Toast.js","./Toaster":"../node_modules/construct-ui/lib/esm/components/toast/Toaster.js"}],"../node_modules/construct-ui/lib/esm/components/tooltip/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tooltip = void 0;

var _tslib = require("tslib");

var _classnames = _interopRequireDefault(require("classnames"));

var _mithril = _interopRequireDefault(require("mithril"));

var _ = require("../..");

var _popover = require("../popover");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tooltip =
/** @class */
function () {
  function Tooltip() {}

  Tooltip.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var size = attrs.size,
        className = attrs.class,
        otherAttrs = (0, _tslib.__rest)(attrs, ["size", "class"]);
    var classes = (0, _classnames.default)(_.Classes.TOOLTIP, size && "cui-" + size, className);
    return (0, _mithril.default)(_popover.Popover, (0, _tslib.__assign)((0, _tslib.__assign)({
      addToStack: false
    }, otherAttrs), {
      class: classes,
      interactionType: 'hover-trigger'
    }));
  };

  return Tooltip;
}();

exports.Tooltip = Tooltip;
},{"tslib":"../node_modules/tslib/tslib.es6.js","classnames":"../node_modules/classnames/index.js","mithril":"../node_modules/mithril/index.js","../..":"../node_modules/construct-ui/lib/esm/index.js","../popover":"../node_modules/construct-ui/lib/esm/components/popover/index.js"}],"../node_modules/construct-ui/lib/esm/components/tree/Tree.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tree = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tree =
/** @class */
function () {
  function Tree() {}

  Tree.prototype.view = function (_a) {
    var attrs = _a.attrs;
    var nodes = attrs.nodes,
        className = attrs.class,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["nodes", "class"]);
    var treeClasses = (0, _classnames.default)(_shared.Classes.TREE, className);
    return (0, _mithril.default)('ul', (0, _tslib.__assign)((0, _tslib.__assign)({}, htmlAttrs), {
      class: treeClasses
    }), nodes);
  };

  return Tree;
}();

exports.Tree = Tree;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../node_modules/construct-ui/lib/esm/components/tree/TreeNode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeNode = void 0;

var _tslib = require("tslib");

var _mithril = _interopRequireDefault(require("mithril"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shared = require("../../_shared");

var _icon = require("../icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeNode =
/** @class */
function () {
  function TreeNode() {}

  TreeNode.prototype.view = function (_a) {
    var _this = this;

    var attrs = _a.attrs;
    var contentLeft = attrs.contentLeft,
        contentRight = attrs.contentRight,
        className = attrs.class,
        children = attrs.children,
        hasCaret = attrs.hasCaret,
        isExpanded = attrs.isExpanded,
        isSelected = attrs.isSelected,
        label = attrs.label,
        onClick = attrs.onClick,
        onCollapse = attrs.onCollapse,
        onExpand = attrs.onExpand,
        htmlAttrs = (0, _tslib.__rest)(attrs, ["contentLeft", "contentRight", "class", "children", "hasCaret", "isExpanded", "isSelected", "label", "onClick", "onCollapse", "onExpand"]);
    var caretClasses = (0, _classnames.default)(_shared.Classes.TREE_NODE_CARET, !hasCaret && _shared.Classes.TREE_NODE_CARET_NONE, hasCaret && (isExpanded ? _shared.Classes.TREE_NODE_CARET_OPEN : _shared.Classes.TREE_NODE_CARET_CLOSED));
    var caret = (0, _mithril.default)(_icon.Icon, {
      class: caretClasses,
      name: _icon.Icons.CHEVRON_RIGHT,
      onclick: function (e) {
        return _this.handleCaretClick(e, attrs);
      }
    });
    var innerContent = [caret, contentLeft && (0, _mithril.default)('', {
      class: _shared.Classes.TREE_NODE_CONTENT_LEFT
    }, contentLeft), label && (0, _mithril.default)('', {
      class: _shared.Classes.TREE_NODE_LABEL
    }, label), contentRight && (0, _mithril.default)('', {
      class: _shared.Classes.TREE_NODE_CONTENT_RIGHT
    }, contentRight)];
    var content = (0, _mithril.default)('', {
      class: _shared.Classes.TREE_NODE_CONTENT,
      onclick: function (e) {
        return _this.handleClick(e, attrs);
      }
    }, innerContent);
    var treeNodeClasses = (0, _classnames.default)(_shared.Classes.TREE_NODE, isSelected && _shared.Classes.TREE_NODE_SELECTED, isExpanded && _shared.Classes.TREE_NODE_EXPANDED, className);
    return (0, _mithril.default)('li', (0, _tslib.__assign)({
      class: treeNodeClasses
    }, htmlAttrs), [content, isExpanded && (0, _mithril.default)('ul', {
      class: _shared.Classes.TREE_NODE_LIST
    }, children)]);
  };

  TreeNode.prototype.handleCaretClick = function (e, attrs) {
    var onCollapse = attrs.onCollapse,
        onExpand = attrs.onExpand,
        isExpanded = attrs.isExpanded;

    if (onCollapse || onExpand) {
      e.stopPropagation();
      (0, _shared.safeCall)(isExpanded ? onCollapse : onExpand, attrs, e);
    } else e.redraw = false;
  };

  TreeNode.prototype.handleClick = function (e, attrs) {
    var onClick = attrs.onClick;
    var el = e.target;
    var isClickOnRightContent = (0, _shared.getClosest)(el, "." + _shared.Classes.TREE_NODE_CONTENT_RIGHT);

    if (onClick && !isClickOnRightContent) {
      (0, _shared.safeCall)(onClick, attrs, e);
    } else e.redraw = false;
  };

  return TreeNode;
}();

exports.TreeNode = TreeNode;
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","../icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js"}],"../node_modules/construct-ui/lib/esm/components/tree/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Tree = require("./Tree");

Object.keys(_Tree).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Tree[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Tree[key];
    }
  });
});

var _TreeNode = require("./TreeNode");

Object.keys(_TreeNode).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _TreeNode[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _TreeNode[key];
    }
  });
});
},{"./Tree":"../node_modules/construct-ui/lib/esm/components/tree/Tree.js","./TreeNode":"../node_modules/construct-ui/lib/esm/components/tree/TreeNode.js"}],"../node_modules/construct-ui/lib/esm/components/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _breadcrumb = require("./breadcrumb");

Object.keys(_breadcrumb).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _breadcrumb[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _breadcrumb[key];
    }
  });
});

var _button = require("./button");

Object.keys(_button).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _button[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _button[key];
    }
  });
});

var _buttonGroup = require("./button-group");

Object.keys(_buttonGroup).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _buttonGroup[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _buttonGroup[key];
    }
  });
});

var _card = require("./card");

Object.keys(_card).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _card[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _card[key];
    }
  });
});

var _callout = require("./callout");

Object.keys(_callout).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _callout[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _callout[key];
    }
  });
});

var _checkbox = require("./checkbox");

Object.keys(_checkbox).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _checkbox[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _checkbox[key];
    }
  });
});

var _collapse = require("./collapse");

Object.keys(_collapse).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _collapse[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _collapse[key];
    }
  });
});

var _controlGroup = require("./control-group");

Object.keys(_controlGroup).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _controlGroup[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _controlGroup[key];
    }
  });
});

var _customSelect = require("./custom-select");

Object.keys(_customSelect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _customSelect[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _customSelect[key];
    }
  });
});

var _dialog = require("./dialog");

Object.keys(_dialog).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _dialog[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _dialog[key];
    }
  });
});

var _drawer = require("./drawer");

Object.keys(_drawer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _drawer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _drawer[key];
    }
  });
});

var _emptyState = require("./empty-state");

Object.keys(_emptyState).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _emptyState[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _emptyState[key];
    }
  });
});

var _form = require("./form");

Object.keys(_form).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _form[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _form[key];
    }
  });
});

var _grid = require("./grid");

Object.keys(_grid).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _grid[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _grid[key];
    }
  });
});

var _icon = require("./icon");

Object.keys(_icon).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _icon[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _icon[key];
    }
  });
});

var _input = require("./input");

Object.keys(_input).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _input[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _input[key];
    }
  });
});

var _inputFile = require("./input-file");

Object.keys(_inputFile).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _inputFile[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _inputFile[key];
    }
  });
});

var _inputPopover = require("./input-popover");

Object.keys(_inputPopover).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _inputPopover[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _inputPopover[key];
    }
  });
});

var _inputSelect = require("./input-select");

Object.keys(_inputSelect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _inputSelect[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _inputSelect[key];
    }
  });
});

var _list = require("./list");

Object.keys(_list).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _list[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _list[key];
    }
  });
});

var _menu = require("./menu");

Object.keys(_menu).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _menu[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _menu[key];
    }
  });
});

var _overlay = require("./overlay");

Object.keys(_overlay).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _overlay[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _overlay[key];
    }
  });
});

var _popover = require("./popover");

Object.keys(_popover).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _popover[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _popover[key];
    }
  });
});

var _popoverMenu = require("./popover-menu");

Object.keys(_popoverMenu).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _popoverMenu[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _popoverMenu[key];
    }
  });
});

var _portal = require("./portal");

Object.keys(_portal).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _portal[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _portal[key];
    }
  });
});

var _queryList = require("./query-list");

Object.keys(_queryList).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _queryList[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _queryList[key];
    }
  });
});

var _radio = require("./radio");

Object.keys(_radio).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _radio[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _radio[key];
    }
  });
});

var _select = require("./select");

Object.keys(_select).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _select[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _select[key];
    }
  });
});

var _selectList = require("./select-list");

Object.keys(_selectList).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _selectList[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _selectList[key];
    }
  });
});

var _spinner = require("./spinner");

Object.keys(_spinner).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _spinner[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _spinner[key];
    }
  });
});

var _switch = require("./switch");

Object.keys(_switch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _switch[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _switch[key];
    }
  });
});

var _table = require("./table");

Object.keys(_table).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _table[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _table[key];
    }
  });
});

var _tabs = require("./tabs");

Object.keys(_tabs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tabs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tabs[key];
    }
  });
});

var _tag = require("./tag");

Object.keys(_tag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tag[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tag[key];
    }
  });
});

var _tagInput = require("./tag-input");

Object.keys(_tagInput).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tagInput[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tagInput[key];
    }
  });
});

var _textArea = require("./text-area");

Object.keys(_textArea).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _textArea[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _textArea[key];
    }
  });
});

var _toast = require("./toast");

Object.keys(_toast).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _toast[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _toast[key];
    }
  });
});

var _tooltip = require("./tooltip");

Object.keys(_tooltip).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tooltip[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tooltip[key];
    }
  });
});

var _tree = require("./tree");

Object.keys(_tree).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tree[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tree[key];
    }
  });
});
},{"./breadcrumb":"../node_modules/construct-ui/lib/esm/components/breadcrumb/index.js","./button":"../node_modules/construct-ui/lib/esm/components/button/index.js","./button-group":"../node_modules/construct-ui/lib/esm/components/button-group/index.js","./card":"../node_modules/construct-ui/lib/esm/components/card/index.js","./callout":"../node_modules/construct-ui/lib/esm/components/callout/index.js","./checkbox":"../node_modules/construct-ui/lib/esm/components/checkbox/index.js","./collapse":"../node_modules/construct-ui/lib/esm/components/collapse/index.js","./control-group":"../node_modules/construct-ui/lib/esm/components/control-group/index.js","./custom-select":"../node_modules/construct-ui/lib/esm/components/custom-select/index.js","./dialog":"../node_modules/construct-ui/lib/esm/components/dialog/index.js","./drawer":"../node_modules/construct-ui/lib/esm/components/drawer/index.js","./empty-state":"../node_modules/construct-ui/lib/esm/components/empty-state/index.js","./form":"../node_modules/construct-ui/lib/esm/components/form/index.js","./grid":"../node_modules/construct-ui/lib/esm/components/grid/index.js","./icon":"../node_modules/construct-ui/lib/esm/components/icon/index.js","./input":"../node_modules/construct-ui/lib/esm/components/input/index.js","./input-file":"../node_modules/construct-ui/lib/esm/components/input-file/index.js","./input-popover":"../node_modules/construct-ui/lib/esm/components/input-popover/index.js","./input-select":"../node_modules/construct-ui/lib/esm/components/input-select/index.js","./list":"../node_modules/construct-ui/lib/esm/components/list/index.js","./menu":"../node_modules/construct-ui/lib/esm/components/menu/index.js","./overlay":"../node_modules/construct-ui/lib/esm/components/overlay/index.js","./popover":"../node_modules/construct-ui/lib/esm/components/popover/index.js","./popover-menu":"../node_modules/construct-ui/lib/esm/components/popover-menu/index.js","./portal":"../node_modules/construct-ui/lib/esm/components/portal/index.js","./query-list":"../node_modules/construct-ui/lib/esm/components/query-list/index.js","./radio":"../node_modules/construct-ui/lib/esm/components/radio/index.js","./select":"../node_modules/construct-ui/lib/esm/components/select/index.js","./select-list":"../node_modules/construct-ui/lib/esm/components/select-list/index.js","./spinner":"../node_modules/construct-ui/lib/esm/components/spinner/index.js","./switch":"../node_modules/construct-ui/lib/esm/components/switch/index.js","./table":"../node_modules/construct-ui/lib/esm/components/table/index.js","./tabs":"../node_modules/construct-ui/lib/esm/components/tabs/index.js","./tag":"../node_modules/construct-ui/lib/esm/components/tag/index.js","./tag-input":"../node_modules/construct-ui/lib/esm/components/tag-input/index.js","./text-area":"../node_modules/construct-ui/lib/esm/components/text-area/index.js","./toast":"../node_modules/construct-ui/lib/esm/components/toast/index.js","./tooltip":"../node_modules/construct-ui/lib/esm/components/tooltip/index.js","./tree":"../node_modules/construct-ui/lib/esm/components/tree/index.js"}],"../node_modules/construct-ui/lib/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shared = require("./_shared");

Object.keys(_shared).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _shared[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _shared[key];
    }
  });
});

var _components = require("./components");

Object.keys(_components).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _components[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _components[key];
    }
  });
});

var _utils = require("./utils");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _utils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _utils[key];
    }
  });
});
},{"./_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","./components":"../node_modules/construct-ui/lib/esm/components/index.js","./utils":"../node_modules/construct-ui/lib/esm/utils/index.js"}],"../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../node_modules/construct-ui/lib/index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"logo.svg":[function(require,module,exports) {
module.exports = "/logo.86ce68ea.svg";
},{}],"components/Nav.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _constructUi = require("construct-ui");

var _logo = _interopRequireDefault(require("../logo.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AppToaster = new _constructUi.Toaster();

function showToast(msg, intent) {
  AppToaster.show({
    message: msg,
    icon: _constructUi.Icons.BELL,
    intent: intent,
    timeout: 2000
  });
}

var DrawerContent = {
  drawerOpen: false,
  class: 'drawer',
  size: 'xl',
  view: function view(vnode) {
    return [(0, _mithril.default)(_constructUi.Button, {
      size: vnode.state.size,
      iconLeft: _constructUi.Icons.MENU,
      style: 'align-self:end',
      basic: true,
      onclick: function onclick() {
        vnode.state.drawerOpen = !vnode.state.drawerOpen;

        _mithril.default.redraw();
      }
    }), (0, _mithril.default)(_constructUi.Drawer, {
      closeOnOutsideClick: true,
      closeOnEscapeKey: true,
      onClose: function onClose() {
        return vnode.state.drawerOpen = false;
      },
      hasBackdrop: true,
      position: 'right',
      isOpen: vnode.state.drawerOpen,
      content: (0, _mithril.default)('.drawer-nav', (0, _mithril.default)(_constructUi.Button, {
        iconLeft: _constructUi.Icons.CHEVRON_RIGHT,
        basic: true,
        style: 'float:right;',
        onclick: function onclick() {
          vnode.state.drawerOpen = false;
        }
      }), (0, _mithril.default)(_mithril.default.route.Link, {
        href: '/main'
      }, (0, _mithril.default)(_constructUi.Button, {
        iconLeft: _constructUi.Icons.SEARCH,
        basic: true,
        fluid: true,
        align: 'left',
        label: 'Availability',
        size: vnode.state.size
      })), (0, _mithril.default)(_mithril.default.route.Link, {
        href: '/orders'
      }, (0, _mithril.default)(_constructUi.Button, {
        iconLeft: _constructUi.Icons.LIST,
        fluid: true,
        basic: true,
        label: 'Orders',
        align: 'left',
        size: vnode.state.size
      })), (0, _mithril.default)(_mithril.default.route.Link, {
        href: '/clients'
      }, (0, _mithril.default)(_constructUi.Button, {
        iconLeft: _constructUi.Icons.USERS,
        fluid: true,
        basic: true,
        align: 'left',
        label: 'Clients',
        size: vnode.state.size
      })), (0, _mithril.default)(_mithril.default.route.Link, {
        href: '/history'
      }, (0, _mithril.default)(_constructUi.Button, {
        iconLeft: _constructUi.Icons.ARCHIVE,
        fluid: true,
        basic: true,
        align: 'left',
        label: 'History',
        size: vnode.state.size
      })), // m(m.route.Link, {
      //   href: '/richieste'
      // },
      // m(Button, {
      //   iconLeft: Icons.TRUCK,
      //   fluid: true,
      //   basic: true,
      //   align: 'left',
      //   label: 'Richieste',
      //   size: vnode.state.size
      // })),
      // m(m.route.Link, {
      //   href: '/dhlTracking'
      // }, m(Button, {
      //   iconLeft: Icons.BOX,
      //   fluid: true,
      //   basic: true,
      //   align: 'left',
      //   label: 'DHL tracking',
      //   size: vnode.state.size
      // })),
      (0, _mithril.default)('.last-row', ((0, _mithril.default)(_constructUi.Button, {
        intent: 'primary',
        size: vnode.state.size,
        iconLeft: _constructUi.Icons.USER,
        fluid: true,
        // label: session.user ? session.user : 'LOGINPC',
        onclick: function onclick() {
          return vnode.state.menuOpen = !vnode.state.menuOpen;
        }
      }), (0, _mithril.default)(_constructUi.Menu, {
        size: vnode.state.size,
        basic: true
      }, (0, _mithril.default)(_constructUi.Tag, {
        label: localStorage.user
      }), (0, _mithril.default)(_constructUi.MenuItem, {
        iconLeft: _constructUi.Icons.LOG_OUT,
        label: 'Log Out',
        onclick: function onclick() {
          // localStorage.clear()
          _mithril.default.request({
            url: '/api/logout'
          }).then(function (res) {
            console.log(res);

            _mithril.default.route.set('/login');
          });
        }
      })))))
    })];
  }
};
var Nav = {
  buttonOptions: {
    iconLeft: _constructUi.Icons.HOME,
    size: 'lg',
    basic: true,
    onclick: function onclick() {
      _mithril.default.route.set('/home');
    }
  },
  // navHomeButton: true ? { IconLeft: Icons.HOME } : { iconLeft: Icons.CHEVRON_LEFT },
  oninit: function oninit(vnode) {
    if (location.hash != '#!/main') vnode.state.buttonOptions = {
      iconLeft: _constructUi.Icons.CHEVRON_LEFT,
      label: 'Back',
      size: 'lg',
      basic: true,
      onclick: function onclick() {
        history.back();
      }
    };
  },
  view: function view(vnode) {
    // let submenu = location.hash.split('/')[1]
    return [(0, _mithril.default)('.nav.flex.space-b', //   m(Breadcrumb, {
    //     size: 'xl',
    //     class: 'breadcrumbs',
    //     seperator: m(Icon, { name: Icons.CHEVRON_RIGHT })
    //   },
    //   m(BreadcrumbItem, {
    //     href: '/#!/main'
    //   }, m(Icon, {
    //     name: Icons.HOME
    //   })),
    //   m(BreadcrumbItem, {
    //     href: `/#!/${submenu}`
    //   }, m('a.breadcrumbs', submenu))
    //
    // ),
    (0, _mithril.default)(_constructUi.Button, vnode.state.buttonOptions), (0, _mithril.default)("img.logo[src=".concat(_logo.default, "][alt='logo']")), (0, _mithril.default)(DrawerContent)), (0, _mithril.default)(AppToaster, {
      position: 'top'
    })];
  }
};
exports.Nav = Nav;
exports.showToast = showToast;
},{"mithril":"../node_modules/mithril/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js","../logo.svg":"logo.svg"}],"components/login.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _Nav = require("./Nav");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//check if session exists
var session = null;
var login = {
  check: function check() {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('running check');

              if (localStorage.smurf && location.hash === '#!/login') {
                _mithril.default.route.set('/main');
              } else {
                _mithril.default.route.set('/login');
              }

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  setDev: function setDev() {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!localStorage.smurf) {
                _context2.next = 6;
                break;
              }

              console.log('setting session');
              _context2.next = 4;
              return _mithril.default.request({
                method: 'POST',
                url: '/api/session',
                headers: {
                  smurf: localStorage.smurf,
                  user: localStorage.user
                }
              }).then(function (res) {
                console.log(res); // m.route.set('/main')
                // showToast('Relogged as ' + localStorage.user)
              });

            case 4:
              _context2.next = 7;
              break;

            case 6:
              _mithril.default.route.set('/login');

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  authenticate: function authenticate(remember, user, pwd) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _mithril.default.request({
                url: "/api/login",
                headers: {
                  'user': user.toLowerCase(),
                  'pwd': pwd.toLowerCase()
                }
              }).then(function (res) {
                if (res.user) {
                  session = res;
                  localStorage.smurf = session.smurf;
                  localStorage.user = session.user;
                  if (remember) localStorage.pwd = pwd;
                  (0, _Nav.showToast)("Welcome back ".concat(localStorage.user, " !"), 'primary');
                }

                login.check();
              });

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  }
};
exports.login = login;
},{"mithril":"../node_modules/mithril/index.js","./Nav":"components/Nav.js"}],"components/Searches.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _constructUi = require("construct-ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Searches = {
  searchesList: [],
  unassignedSearches: [],
  assignedSearches: {},
  loadSearches: function () {
    var _loadSearches = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _mithril.default.request({
                method: "GET",
                url: "/api/SearchInstances"
              }).then(function (res) {
                Searches.searchesList = res;
                Searches.assignedSearches = [];
                Searches.filterSearches(res);
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function loadSearches() {
      return _loadSearches.apply(this, arguments);
    }

    return loadSearches;
  }(),
  filterSearches: function filterSearches(searches) {
    console.log('filtering searches');
    Searches.unassignedSearches = searches.filter(function (item) {
      return item.order === 'unassigned';
    });
    searches.map(function (search) {
      if (search.order != 'unassigned') {
        if (!Searches.assignedSearches[search.order]) {
          Searches.assignedSearches[search.order] = [];
          Searches.assignedSearches[search.order].push(search);
        } else {
          Searches.assignedSearches[search.order].push(search);
        }
      }
    });
  },
  oninit: function oninit() {
    if (Searches.searchesList.length === 0) {
      console.log(Searches);
      Searches.loadSearches();
    }
  },
  view: function view() {
    return (0, _mithril.default)(_constructUi.List, {
      interactive: true,
      size: 'md',
      class: 'flex searches-list',
      style: 'max-height:none;flex-direction: column'
    }, Searches.searchesList.map(function (item) {
      return (0, _mithril.default)(_constructUi.ListItem, {
        label: "".concat(item.year).concat(item.season, " ").concat(item.model, " ").concat(item.color, " ").concat(item.size),
        contentRight: [(0, _mithril.default)(_constructUi.Tag, {
          label: item.descr,
          size: 'sm'
        }), (0, _mithril.default)(_constructUi.Tag, {
          label: '€' + item.price + ',00',
          intent: 'warning'
        })]
      });
    }));
  }
};
exports.Searches = Searches;
},{"mithril":"../node_modules/mithril/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js"}],"components/Orders.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _constructUi = require("construct-ui");

var _Searches = require("./Searches");

var _Nav = require("./Nav");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AssignedSearch() {
  return {
    view: function view(vnode) {
      var item = vnode.attrs.search; // let contentL = m(Button, {
      //   iconLeft: Icons.MINUS,
      //   intent: 'negative',
      //   size: 'xs',
      //   class: 'remove-search',
      //   onclick: (e) => {
      //     //UNASSIGN SEARCH
      //     e.preventDefault()
      //     e.stopPropagation()
      //     console.log(1);
      //     m.request({
      //       method: 'GET',
      //       url: `/api/addToClient/unassigned/${item._id}`
      //     }).then(res => {
      //       console.log(res);
      //       showToast(`Unassigned ${item.model}`, 'warning')
      //     })
      //   }
      // })

      return (0, _mithril.default)(_constructUi.ListItem, {
        // label: `${item.model} ${item.color} ${item.size}`,
        class: "list-item-".concat(vnode.attrs.index),
        contentLeft: (0, _mithril.default)('.list-content', [(0, _mithril.default)('.left-content.flex.space-b', (0, _mithril.default)('.label', "".concat(item.model, " ").concat(item.color, " ").concat(item.size)), (0, _mithril.default)(_constructUi.Tag, {
          intent: 'warning',
          size: 'xs',
          label: "\u20AC".concat(item.price)
        })), (0, _mithril.default)('.descr-content', (0, _mithril.default)(_constructUi.Tag, {
          size: 'xs',
          label: item.descr
        }))]) // contentRight: [
        //   m(Tag, {
        //     size: 'xs',
        //     label: item.descr
        //   }),
        //   m(Tag, {
        //     intent: 'warning',
        //     size: 'xs',
        //     label: `€${item.price}`
        //   })
        // ]

      });
    }
  };
}

var Orders = {
  ordersList: [],
  loadOrders: function loadOrders() {
    _mithril.default.request({
      method: "GET",
      url: "/api/listOrders",
      headers: {
        user: localStorage.user
      }
    }).then(function (res) {
      Orders.ordersList = res;
    });
  },
  oninit: function oninit() {
    console.log(Orders);

    if (Orders.ordersList.length === 0) {
      Orders.loadOrders();

      _Searches.Searches.loadSearches();
    }
  },
  order: {
    oninit: function oninit(vnode) {
      vnode.state.selected = false;
      vnode.state.pieces = 0;
      vnode.state.total = 0;
    },
    onupdate: function onupdate(vnode) {
      vnode.state.pieces = 0;
      vnode.state.total = 0;
    },
    view: function view(vnode) {
      var order = vnode.attrs.order; // let o = vnode.attrs.o

      return (0, _mithril.default)(_constructUi.Card, {
        class: "order client-order",
        id: order._id,
        clientId: order.clientId,
        interactive: true,
        fluid: true,
        elevation: 2 // SELECT ORDER

      }, (0, _mithril.default)(_constructUi.PopoverMenu, {
        closeOnContentClick: true,
        content: [(0, _mithril.default)(_constructUi.Button, {
          iconLeft: _constructUi.Icons.EDIT,
          label: 'Edit',
          basic: true,
          align: 'center',
          onclick: function onclick() {
            _mithril.default.route.set("/orders/edit/".concat(order.id));
          }
        }), (0, _mithril.default)(_constructUi.Button, {
          iconLeft: _constructUi.Icons.TRASH,
          intent: 'negative',
          label: 'Delete',
          basic: true,
          align: 'center',
          onclick: function onclick(e) {
            // DELETE ORDER
            e.preventDefault();
            e.stopPropagation();
            console.log('deleting order ' + order._id);

            _mithril.default.request({
              method: "DELETE",
              url: "/api/deleteOrder/".concat(order._id)
            }).then(function (res) {
              Orders.ordersList.splice(Orders.ordersList.indexOf(res), 1);
            });
          }
        })],
        trigger: (0, _mithril.default)(_constructUi.Button, {
          iconLeft: _constructUi.Icons.SETTINGS,
          style: 'float:right;'
        })
      }), [(0, _mithril.default)(".order-client-name[id=".concat(order.clientId, "]"), (0, _mithril.default)("h1", order.clientName)), (0, _mithril.default)(_constructUi.Tag, {
        label: order.date,
        class: 'date'
      })], [(0, _mithril.default)(_constructUi.List, {
        size: 'xs',
        style: "margin-top:1rem;",
        class: 'collapsible assigned-searches'
      }, _Searches.Searches.assignedSearches[order._id] && vnode.state.pieces === 0 ? _Searches.Searches.assignedSearches[order._id].map(function (search, i) {
        if (vnode.state.pieces < document.querySelectorAll('.assigned-searches .cui-list-item').length) {
          document.querySelectorAll('.assigned-searches .cui-list-item');
          vnode.state.pieces++;
          vnode.state.total += parseInt(search.price);
        }

        return (0, _mithril.default)(AssignedSearch, {
          search: search,
          index: i
        });
      }) : undefined), (0, _mithril.default)('.row.totals', (0, _mithril.default)(_constructUi.Tag, {
        label: "total pcs: ".concat(vnode.state.pieces)
      }), (0, _mithril.default)(_constructUi.Tag, {
        label: "total: \u20AC".concat(vnode.state.total),
        intent: 'warning'
      })), (0, _mithril.default)(_constructUi.Button, {
        fluid: true,
        class: 'expand-icon',
        size: 'md',
        style: 'margin: auto; display: block; padding: 0; transition: rotate .3s',
        iconLeft: _constructUi.Icons.CHEVRON_UP,
        basic: true,
        onclick: function onclick(e) {
          e.preventDefault();
          e.stopPropagation();
          var expandIcon = vnode.dom.querySelector('.expand-icon');
          var list = vnode.dom.querySelector('.assigned-searches');
          list.classList.toggle('collapsed');
          expandIcon.classList.toggle('reversed');
        }
      })]);
    }
  },
  view: function view() {
    // UNASSIGNED SEARCHES MOVED TO EDIT ORDER
    return [(0, _mithril.default)(_constructUi.Input, {
      contentRight: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.FILTER
      }),
      placeholder: 'Filter Orders',
      oninput: function oninput(e) {
        var val = e.target.value.toLowerCase();
        var orders = e.target.parentElement.parentElement.querySelectorAll('.client-order');
        orders.forEach(function (order) {
          var text = order.textContent.toLowerCase();
          text.includes(val) ? (order.style.order = '-1', order.style.display = 'block') : (order.style.order = 'unset', order.style.display = 'none');
        });
      }
    }), (0, _mithril.default)('.orders.flex.column', Orders.ordersList.map(function (order, o) {
      return (0, _mithril.default)(Orders.order, {
        order: order,
        o: o
      });
    }))];
  }
};
exports.Orders = Orders; // exports.AssignedSearch = AssignedSearch
},{"mithril":"../node_modules/mithril/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js","./Searches":"components/Searches.js","./Nav":"components/Nav.js"}],"components/Clients.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _constructUi = require("construct-ui");

var _Nav = require("./Nav");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Clients = {
  clientsList: [],
  dialogOpen: false,
  loadClients: function loadClients() {
    _mithril.default.request({
      method: "GET",
      url: "/api/listClients"
    }).then(function (res) {
      return Clients.clientsList = res;
    });
  },
  close: function close(vnode) {
    vnode.state.dialogOpen = false;
  },
  oninit: function oninit() {
    if (Clients.clientsList.length === 0) {
      Clients.loadClients();
    }
  },
  view: function view() {
    return (0, _mithril.default)('.clients-section', (0, _mithril.default)(_constructUi.Input, {
      contentRight: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.FILTER
      }),
      placeholder: 'Filter Clients',
      oninput: function oninput(e) {
        var val = e.target.value.toLowerCase();
        var clients = e.target.parentElement.parentElement.querySelectorAll('.client-card');
        clients.forEach(function (client) {
          var text = client.textContent.toLowerCase();
          text.includes(val) ? (client.style.order = '-1', client.style.display = 'block') : (client.style.order = 'unset', client.style.display = 'none');
        });
      }
    }), (0, _mithril.default)('ul.client-list.flex.column', Clients.clientsList.map(function (client) {
      return [(0, _mithril.default)(_constructUi.Card, {
        class: 'client-card',
        url: client._id,
        elevated: 2,
        interactive: true,
        fluid: true
      }, (0, _mithril.default)(_constructUi.Button, {
        iconLeft: _constructUi.Icons.EDIT,
        label: 'Edit',
        style: 'float: right',
        basic: true,
        align: 'center',
        onclick: function onclick(e) {
          e.preventDefault();
          e.stopPropagation();

          _mithril.default.route.set("/clients/edit/".concat(client._id));
        }
      }), (0, _mithril.default)("h1#client-name", client.name + ' ' + client.surname), (0, _mithril.default)(_constructUi.Button, {
        class: 'mail-copy-button',
        label: "mail: ".concat(client.mail || ''),
        iconLeft: _constructUi.Icons.COPY,
        basic: true,
        onclick: function onclick(e) {
          e.preventDefault();
          navigator.clipboard.writeText(client.mail);
        }
      }), (0, _mithril.default)(_constructUi.Button, {
        class: 'phone-copy-button',
        label: "phone: ".concat(client.phone),
        iconLeft: _constructUi.Icons.COPY,
        basic: true,
        onclick: function onclick(e) {
          e.preventDefault();
          navigator.clipboard.writeText(client.phone);
        }
      }))];
    })));
  }
};
exports.Clients = Clients;
},{"mithril":"../node_modules/mithril/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js","./Nav":"components/Nav.js"}],"components/Tabs.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _constructUi = require("construct-ui");

var _Nav = require("./Nav");

var _Orders = require("./Orders");

var _Clients = require("./Clients");

var _Searches = require("./Searches");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var seaching = false,
    session;
var AppToaster = new _constructUi.Toaster(); // let Orders = {
//   ordersList: [],
//   loadOrders: () => {
//     m.request({
//       method: "GET",
//       url: "/api/listOrders"
//     }).then(res => {
//       console.log(res);
//       Orders.ordersList = res
//       return res
//     })
//   },
//   oninit: (vnode) => {
//     if (Orders.ordersList.length === 0) {
//       Orders.loadOrders()
//       Searches.loadSearches()
//     }
//   },
//   order: {
//     oninit: (vnode) => {
//       vnode.state.selected = false
//       vnode.state.pieces = 0
//       vnode.state.total = 0
//     },
//     onupdate: (vnode) => {
//       vnode.state.pieces = 0
//       vnode.state.total = 0
//     },
//     view: (vnode) => {
//       let order = vnode.attrs.order
//       let o = vnode.attrs.o
//       return m(Card, {
//           class: `order client-order collapsible`,
//           id: order._id,
//           clientId: order.clientId,
//           interactive: true,
//           fluid: true,
//           elevation: 2
//           // SELECT ORDER
//         }, m(PopoverMenu, {
//           closeOnContentClick: true,
//           content: [
//             m(Button, {
//               iconLeft: Icons.TRASH,
//               intent: 'negative',
//               label: 'Delete',
//               basic: true,
//               align: 'center',
//               onclick: (e) => {
//                 // DELETE ORDER
//                 e.preventDefault();
//                 e.stopPropagation();
//                 console.log('deleting order ' + order._id);
//                 m.request({
//                   method: "DELETE",
//                   url: `/api/deleteOrder/${order._id}`
//                 }).then(res => {
//                   console.log(res)
//                   Orders.ordersList.splice(Orders.ordersList.indexOf(res), 1)
//                 })
//               }
//             })
//           ],
//           trigger: m(Button, {
//             iconLeft: Icons.SETTINGS,
//             style: 'float:right;',
//           })
//         }),
//         [m(`.order-client-name[id=${order.clientId}]`, {
//             onclick: () => {
//               m.route.set(`/orders/edit/${order.id}`)
//             }
//           }, m(`h1`, order.clientName)),
//           m(Tag, {
//             label: order.date,
//             class: 'date'
//           }),
//           m(Tag, {
//             label: order.user,
//             intent: 'primary',
//             class: 'user'
//           })
//           //, m(Tag, {
//           //   label: order._id,
//           //   class: 'url',
//           //   size: 'xs',
//           //   url: order._id
//           // })
//         ],
//         [
//           m(List, {
//               size: 'xs',
//               style: `margin-top:1rem;`,
//               class: 'collapsible assigned-orders'
//             },
//
//             Searches.assignedSearches[order._id] ? (
//               Searches.assignedSearches[order._id].map(search => {
//                 vnode.state.pieces++
//                 vnode.state.total += parseInt(search.price)
//                 return m(AssignedSearch, {
//                   search: search
//                 })
//               })
//             ) : undefined
//           ), m('.row.searches-totals',
//             m(Tag, {
//               label: `total pcs: ${vnode.state.pieces}`
//             }),
//             m(Tag, {
//               label: `total: €${vnode.state.total}`,
//               intent: 'warning'
//             })), m(Button, {
//             fluid: true,
//             size: 'md',
//             style: 'margin: auto; display: block; padding: 0; transition: rotate .3s',
//             iconLeft: Icons.CHEVRON_DOWN,
//             basic: true,
//             onclick: (e) => {
//               e.preventDefault()
//               e.stopPropagation()
//               let list = vnode.dom.querySelector('.assigned-orders')
//               list.classList.toggle('collapsed')
//               console.log(vnode);
//               let svg = e.target.children[0]
//               m.redraw()
//             }
//           })
//         ])
//     }
//   },
//   view: (vnode) => {
//     // let array
//     // if (Searches.unassignedSearches.length != 0) {
//     //   array = Searches.unassignedSearches.map(item => {
//     //     return m(UnassignedSearch, {
//     //       item: item,
//     //     })
//     //   })
//     // }
//
//     return [m('.orders.flex.reverse', Orders.ordersList.map((order, o) => {
//       return m(Orders.order, {
//         order: order,
//         o: o
//       })
//     }))]
//     // ,
//     // m('h1', 'Unassigned Searches'),
//     // m(Card, {
//     //   fluid: true
//     // }, m(List, {
//     //   class: 'unassigned-searches',
//     //   interactive: false,
//     //   size: 'xs'
//     // }, m('.list-items-wrapper',
//     //   array
//     // )))
//
//   }
// }

var ordersSection = {
  view: function view(vnode) {
    return [(0, _mithril.default)(_Nav.Nav), (0, _mithril.default)('.container.orders', (0, _mithril.default)("h1", "Your Orders"), (0, _mithril.default)(_constructUi.Button, {
      basic: true,
      iconLeft: _constructUi.Icons.REFRESH_CW,
      style: 'float: right;',
      // loading: vnode.tag.loading,
      onclick: function () {
        var _onclick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _Orders.Orders.loadOrders();

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function onclick() {
          return _onclick.apply(this, arguments);
        }

        return onclick;
      }()
    }), (0, _mithril.default)(".orders-container", [(0, _mithril.default)(".create-order", [(0, _mithril.default)(_constructUi.Button, {
      label: 'New Order',
      iconLeft: _constructUi.Icons.PLUS,
      //CREATE NEW ORDER
      onclick: function onclick() {
        _mithril.default.mount(document.querySelector('.new-order'), {
          oninit: function oninit() {
            if (_Clients.Clients.clientsList.length === 0) {
              _Clients.Clients.loadClients();
            }
          },
          view: function view() {
            return (0, _mithril.default)('.order-div', [// CREATE ORDER
            (0, _mithril.default)(_constructUi.SelectList, {
              items: _Clients.Clients.clientsList,
              itemRender: function itemRender(item) {
                return (0, _mithril.default)(_constructUi.ListItem, {
                  label: item.fullname,
                  url: item._id,
                  name: item.name,
                  surname: item.surname,
                  contentLeft: (0, _mithril.default)('div', '+')
                });
              },
              itemPredicate: function itemPredicate(query, item) {
                return item.fullname.toLowerCase().includes(query.toLowerCase());
              },
              onSelect: function onSelect(item) {
                console.log(item);

                _mithril.default.request({
                  method: "POST",
                  url: "/api/createOrder/".concat(item._id, "/").concat(item.name, "&").concat(item.surname),
                  headers: {
                    user: localStorage.user
                  }
                }).then(function (res) {
                  console.log(res);

                  _Orders.Orders.ordersList.push(res);
                });
              },
              trigger: (0, _mithril.default)(_constructUi.Button, {
                iconLeft: _constructUi.Icons.USERS,
                label: "Search Client",
                iconRight: _constructUi.Icons.CHEVRON_DOWN
              })
            })]);
          }
        });
      }
    })]), (0, _mithril.default)('.new-order'), (0, _mithril.default)(".search-results"), // m(".order-list", m(Orders))
    (0, _mithril.default)(".order-list", (0, _mithril.default)(_Orders.Orders))]))];
  }
};
var clientsSection = {
  loading: false,
  view: function view(vnode) {
    return [(0, _mithril.default)(_Nav.Nav), (0, _mithril.default)('.container.clients', (0, _mithril.default)("h1", "Client List"), (0, _mithril.default)(_constructUi.Button, {
      basic: true,
      iconLeft: _constructUi.Icons.REFRESH_CW,
      style: 'float: right;',
      loading: vnode.state.loading,
      onclick: function () {
        var _onclick2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  vnode.state.loading = !vnode.state.loading;
                  _context2.next = 3;
                  return _Clients.Clients.loadClients();

                case 3:
                  console.log(_Clients.Clients.clientsList);
                  vnode.state.loading = !vnode.state.loading;

                case 5:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function onclick() {
          return _onclick2.apply(this, arguments);
        }

        return onclick;
      }()
    }), (0, _mithril.default)(".client-content", [(0, _mithril.default)(".new-client.row", [(0, _mithril.default)(_constructUi.Button, {
      onclick: function onclick() {
        document.querySelector('.new-client.row').classList.toggle('reveal-inputs');
      },
      label: "New Client",
      iconLeft: _constructUi.Icons.PLUS
    }), (0, _mithril.default)(_constructUi.ControlGroup, {
      class: 'new-client-inputs'
    }, [(0, _mithril.default)(_constructUi.Input, {
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.USER
      }),
      type: 'text',
      name: 'client-name',
      placeholder: 'Name'
    }), (0, _mithril.default)(_constructUi.Input, {
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.USER
      }),
      type: 'text',
      name: 'client-surname',
      placeholder: 'Surname'
    }), (0, _mithril.default)(_constructUi.Input, {
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.MAIL
      }),
      type: 'text',
      name: 'client-mail',
      placeholder: 'email'
    }), (0, _mithril.default)(_constructUi.Input, {
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.PHONE
      }),
      type: 'text',
      name: 'client-phone',
      placeholder: 'Telephone'
    }), (0, _mithril.default)(_constructUi.Button, {
      type: 'submit',
      style: 'display:block;',
      label: "Add Client",
      // CREATE NEW CLIENT
      onclick: function () {
        var _onclick3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
          var name, surname, mail, phone;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  name = document.querySelector('input[name="client-name"]').value.trim();
                  surname = document.querySelector('input[name="client-surname"]').value.trim();
                  mail = document.querySelector('input[name="client-mail"]').value.trim();
                  phone = document.querySelector('input[name="client-phone"]').value.trim();
                  _context3.next = 6;
                  return _mithril.default.request({
                    method: "GET",
                    url: "/api/newClient",
                    headers: {
                      name: name,
                      surname: surname,
                      mail: mail,
                      phone: phone
                    }
                  }).then(function (client) {
                    _Clients.Clients.clientsList.push(client);

                    document.querySelector('.new-client.row').classList.toggle('reveal-inputs');
                    (0, _Nav.showToast)("Added ".concat(client.fullname, "!"), 'primary');
                  });

                case 6:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        function onclick() {
          return _onclick3.apply(this, arguments);
        }

        return onclick;
      }()
    })])]), (0, _mithril.default)(_Clients.Clients)]))];
  }
};
var historySection = {
  historyList: [],
  view: function view() {
    return [(0, _mithril.default)(_Nav.Nav), (0, _mithril.default)('.container.history', (0, _mithril.default)("h1", "A History of your Searches"), (0, _mithril.default)(_constructUi.Button, {
      basic: true,
      iconLeft: _constructUi.Icons.TRASH,
      compact: true,
      label: 'Clear Unassigned Searches',
      onclick: function onclick() {
        _mithril.default.request({
          method: 'DELETE',
          url: '/api/deleteSearches'
        }).then(function (res) {
          return (0, _Nav.showToast)("Deleted ".concat(res, " Searches!"), 'negative');
        });
      }
    }), (0, _mithril.default)(_constructUi.Button, {
      basic: true,
      iconLeft: _constructUi.Icons.REFRESH_CW,
      style: 'float: right;',
      // loading: vnode.tag.loading,
      onclick: function () {
        var _onclick4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return _Searches.Searches.loadSearches();

                case 2:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function onclick() {
          return _onclick4.apply(this, arguments);
        }

        return onclick;
      }()
    }), (0, _mithril.default)(_Searches.Searches))];
  }
};

function classy(elem, c, addRemoveToggle) {
  if (_typeof(elem) === 'object') {
    elem.classList[addRemoveToggle](c);
  } else {
    var e = document.querySelectorAll(elem);
    e.forEach(function (item) {
      item.classList[addRemoveToggle](c);
    });
  }
}

function s(query, cb) {
  var e = document.querySelectorAll(query);
  e.length = 1 ? cb(e) : e.forEach(function (item) {
    cb(item);
  });
}

exports.ordersSection = ordersSection;
exports.clientsSection = clientsSection;
exports.historySection = historySection;
},{"mithril":"../node_modules/mithril/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js","./Nav":"components/Nav.js","./Orders":"components/Orders.js","./Clients":"components/Clients.js","./Searches":"components/Searches.js"}],"components/EditClient.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _constructUi = require("construct-ui");

var _Nav = require("./Nav");

var _Clients = require("./Clients");

var _Orders = require("./Orders");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Inputs = {
  // name: '',
  // surname: '',
  // mail: '',
  // phone: '',
  size: 'lg',
  oninit: function oninit(vnode) {
    vnode.state.name = vnode.attrs.client.name;
    vnode.state.surname = vnode.attrs.client.surname;
    vnode.state.mail = vnode.attrs.client.mail;
    vnode.state.phone = vnode.attrs.client.phone;
  },
  view: function view(vnode) {
    return (0, _mithril.default)('.inputs', (0, _mithril.default)('.input-wrapper', (0, _mithril.default)(_constructUi.Input, {
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.USER
      }),
      value: vnode.state.name,
      placeholder: 'Client name',
      oninput: function oninput(e) {
        vnode.state.name = e.srcElement.value;
      },
      size: vnode.state.size
    })), (0, _mithril.default)('.input-wrapper', (0, _mithril.default)(_constructUi.Input, {
      value: vnode.state.surname,
      oninput: function oninput(e) {
        vnode.state.surname = e.srcElement.value;
      },
      placeholder: 'Client surname',
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.USER
      }),
      size: vnode.state.size
    })), (0, _mithril.default)('.input-wrapper', (0, _mithril.default)(_constructUi.Input, {
      placeholder: 'Mail',
      class: 'mail-input',
      type: 'email',
      value: vnode.state.mail,
      oninput: function oninput(e) {
        vnode.state.mail = e.srcElement.value;
      },
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.MAIL
      }),
      size: vnode.state.size
    })), (0, _mithril.default)('.input-wrapper', (0, _mithril.default)(_constructUi.Input, {
      placeholder: 'Telephone number',
      type: 'tel',
      value: vnode.state.phone,
      oninput: function oninput(e) {
        vnode.state.phone = e.srcElement.value;
      },
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.PHONE
      }),
      size: vnode.state.size
    })), (0, _mithril.default)('.buttons]', (0, _mithril.default)(_constructUi.Button, {
      label: 'Discard Changes',
      iconLeft: _constructUi.Icons.TRASH,
      onclick: function onclick() {
        _mithril.default.route.set('/clients');
      }
    }), (0, _mithril.default)(_constructUi.Button, {
      label: 'Save Changes',
      iconLeft: _constructUi.Icons.SAVE,
      intent: 'primary',
      interactive: true,
      onclick: function onclick() {
        _mithril.default.request({
          method: 'POST',
          url: '/api/updateClient',
          headers: {
            id: vnode.attrs.client.id,
            name: vnode.state.name,
            surname: vnode.state.surname,
            mail: vnode.state.mail,
            phone: vnode.state.phone
          }
        }).then(function (res) {
          return (0, _Nav.showToast)("Updated client ".concat(res.name, "!"), 'positive');
        });
      }
    })));
  }
};
var EditClient = {
  // client: {},
  loadClient: function loadClient(vnode) {
    return _mithril.default.request({
      method: 'GET',
      url: "/api/client/".concat(vnode.attrs.id)
    }).then(function (res) {
      return vnode.state.client = res[0];
    });
  },
  oninit: function oninit(vnode) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var client;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              client = _Clients.Clients.clientsList.length > 0 ? _Clients.Clients.clientsList.filter(function (item) {
                return item.id == vnode.attrs.id;
              })[0] : null;
              console.log(client);
              _context.t0 = client;

              if (_context.t0) {
                _context.next = 7;
                break;
              }

              _context.next = 6;
              return vnode.state.loadClient(vnode);

            case 6:
              _context.t0 = _context.sent;

            case 7:
              vnode.state.client = _context.t0;

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  view: function view(vnode) {
    if (vnode.state.client) {
      return [(0, _mithril.default)(_Nav.Nav), (0, _mithril.default)('.client-edit-wrapper', (0, _mithril.default)(_constructUi.Card, {
        fluid: true
      }, (0, _mithril.default)('.title', (0, _mithril.default)('h1#client-name', vnode.state.client.fullname), (0, _mithril.default)(_constructUi.Tag, {
        size: 'xs',
        label: vnode.attrs.id
      })), (0, _mithril.default)('.edit-inputs', (0, _mithril.default)(Inputs, {
        client: vnode.state.client
      }))))];
    }
  }
};
module.exports = EditClient;
},{"mithril":"../node_modules/mithril/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js","./Nav":"components/Nav.js","./Clients":"components/Clients.js","./Orders":"components/Orders.js"}],"components/Richieste.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _constructUi = require("construct-ui");

var _Nav = require("./Nav");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var socket = (0, _socket.default)('http://localhost:3000');
var mockrequests = [{
  nr: '1',
  date: "23/12/20",
  season: "202",
  line: "2",
  model: "m2200162",
  color: "cw425",
  size: "50",
  user: "ntaov",
  client: "elena",
  feedback: "",
  order: ""
}, {
  nr: '2',
  date: "23/12/20",
  season: "202",
  line: "1",
  model: "m2300150",
  color: "cs170",
  size: "50",
  user: "mpetrosi",
  client: "natalia",
  feedback: "ok da Parigi, rientra il 10/01",
  order: "#24551 r15"
}, {
  nr: '3',
  date: "23/12/20",
  season: "202",
  line: "1",
  model: "m2200295",
  color: "cp015",
  size: "50",
  user: "ntaov",
  client: "kristina",
  feedback: "",
  order: ""
}, {
  nr: '4',
  date: "10/06/20",
  season: "202",
  line: "2",
  model: "m2300100",
  color: "cg217",
  size: "50",
  user: "mpetrosi",
  client: "natalia",
  feedback: "ok da Parigi, rientra il 10/01",
  order: "#24551 r15"
}, {
  nr: '5',
  date: "21/12/20",
  season: "202",
  line: "2",
  model: "m2200100",
  color: "cw425",
  size: "50",
  user: "ntaov",
  client: "kristina",
  feedback: "",
  order: ""
}, {
  nr: '6',
  date: "23/05/20",
  season: "202",
  line: "2",
  model: "m2300100",
  color: "cg217",
  size: "50",
  user: "maki",
  client: "mrochko",
  feedback: "ok da Parigi, rientra il 10/01",
  order: "#24551 r15"
}, {
  nr: '7',
  date: "23/12/20",
  season: "202",
  line: "2",
  model: "m2200100",
  color: "cw425",
  size: "50",
  user: "ntaov",
  client: "kristina",
  feedback: "",
  order: ""
}, {
  nr: '8',
  date: "23/12/20",
  season: "202",
  line: "2",
  model: "m2300100",
  color: "cg217",
  size: "50",
  user: "mpetrosi",
  client: "natalia",
  feedback: "ok da Parigi, rientra il 10/01",
  order: "#24551 r15"
}];
var requests = [];
var originalRequests = {};
var changes = {};
var headers = ["actions", "nr", "day", "season", "line", "model", "color", "size", "user", "client", "feedback", "order", "status"];
var filter = {}; // Creating Sets to create unique values to pass to the filter

var mySets = {};
socket.on("remote-input", function (item) {
  console.log(item);
  document.querySelector("input.request-".concat(item.id, ".request-").concat(item.field)).value = item.value;

  _mithril.default.redraw();
});
headers.forEach(function (field, i) {
  mySets["".concat(field, "Set")] = new Set();
});

function addToSets(req) {
  var vals = Object.values(req);
  var fields = Object.keys(req);
  fields.forEach(function (field, i) {
    var val = vals[i];

    if (headers.indexOf(field) != -1) {
      mySets["".concat(field, "Set")].add(val);
    }
  });
}

Object.filter = function (obj, filter) {
  var key,
      results = [];
  var queries = Object.keys(filter).filter(function (item) {
    return filter[item] != null;
  });

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      var search = obj[key];

      if (queries.length > 0) {
        for (var i = 0; i < queries.length; i++) {
          var q = queries[i];

          if (!search[q].includes(filter[q])) {
            i++;
          } else if (i === queries.length - 1 && search[q].includes(filter[q])) {
            results.push(search);
          }
        }
      } else {
        results = obj;
      }
    }
  }

  return results;
};

function itemFilter(search, filter) {
  var key,
      results = false;
  var queries = Object.keys(filter).filter(function (item) {
    return filter[item] != null;
  });

  if (queries.length > 0) {
    for (var i = 0; i < queries.length; i++) {
      var q = queries[i];

      if (!search[q].includes(filter[q])) {
        console.log('not a match');
        i++;
      } else if (i === queries.length - 1 && search[q].includes(filter[q])) {
        console.log('a match');
        results = true;
      }
    }
  } else {
    results = true;
  }

  console.log(results);
  return results;
}

function clearDiffs() {
  document.querySelectorAll('input.diffed').forEach(function (item) {
    item.classList.remove('diffed');
  });
  changes = {};
}

function Header(vnode) {
  var header = vnode.attrs.header;

  var options = _toConsumableArray(mySets["".concat(header, "Set")]);

  var checkedOptions = []; // const indeterminate = state.checkedOptions.length > 0 && state.checkedOptions < state.options.length
  // const checked = state.checkedOptions.length === state.options.length

  console.log(options);

  var filterCheckboxes = _toConsumableArray(mySets["".concat(header, "Set")]).map(function (item) {
    return (0, _mithril.default)(_constructUi.Checkbox, {
      label: item
    });
  });

  return {
    view: function view(vnode) {
      return (0, _mithril.default)(".header-tag.header-".concat(header), [(0, _mithril.default)(_constructUi.Popover, {
        closeOnEscapeKey: true,
        content: (0, _mithril.default)('.checkboxes.flex.column', [(0, _mithril.default)(_constructUi.Checkbox, {
          // indeterminate,
          // checked,
          label: 'Select All',
          onchange: function onchange(e) {// state.onCheckAll(e)
          }
        }) // filterCheckboxes
        ]),
        trigger: (0, _mithril.default)(_constructUi.Button, {
          label: header,
          fluid: true,
          size: 'xs',
          outlined: true,
          disabled: header === 'actions' ? true : false // iconLeft: Icons.FILTER

        })
      }), (0, _mithril.default)(_constructUi.Input, {
        placeholder: header,
        class: "header-".concat(header),
        disabled: header === 'actions' ? true : false,
        fluid: true,
        outlined: true,
        // Filter text
        oninput: function oninput(e) {
          Richieste.filter[header] = e.target.value.toLowerCase();
        }
      })]);
    }
  };
}

var Headers = {
  view: function view(vnode) {
    return headers.map(function (header) {
      return (0, _mithril.default)(Header, {
        header: header
      });
    });
  }
};
var MenuComponent = {
  view: function view(vnode) {
    var basic = true;
    return (0, _mithril.default)('.menu-wrapper', [(0, _mithril.default)(_constructUi.Button, {
      iconLeft: _constructUi.Icons.SAVE,
      label: 'Save',
      basic: basic,
      onclick: function onclick(e) {
        var ids = Object.keys(changes);
        var fields, values;
        ids.map(function (id, i) {
          fields = Object.keys(changes[id]);
          values = Object.values(changes[id]).join('&');
          console.log(id);
          console.log(fields, values);

          _mithril.default.request({
            method: 'POST',
            url: '/api/updateRequests',
            headers: {
              id: id,
              idfields: fields,
              idvalues: values,
              last: i === ids.length - 1 ? true : false
            }
          }).then(function (res) {
            console.log(res);
            Richieste.getRequests();
          });
        });
      }
    }), (0, _mithril.default)(_constructUi.Button, {
      iconLeft: _constructUi.Icons.PLUS,
      basic: basic,
      onclick: function onclick() {
        Richieste.addRow();
        console.log(requests);
      }
    })]);
  }
};
var Request = {
  inputs: [],
  size: 'xs',
  reset: function reset(v) {
    console.log(v); // vnode.key = false
    // vnode.key = vnode.key
  },
  onupdate: function onupdate(vnode) {
    vnode.state.request = vnode.attrs.request;
    vnode.state.request.nr = JSON.stringify(vnode.attrs.index); // vnode.state.reset(vnode, vnode.key)

    vnode.state.request.model = '0';
  },
  oninit: function oninit(vnode) {
    // vnode.state.originalRequest = originalRequests[vnode.attrs.request._id]
    vnode.state.request = vnode.attrs.request;
    vnode.state.request.nr = JSON.stringify(vnode.attrs.index);
    var _vnode$state$request = vnode.state.request,
        _id = _vnode$state$request._id,
        nr = _vnode$state$request.nr,
        day = _vnode$state$request.day,
        season = _vnode$state$request.season,
        line = _vnode$state$request.line,
        model = _vnode$state$request.model,
        color = _vnode$state$request.color,
        size = _vnode$state$request.size,
        user = _vnode$state$request.user,
        cliente = _vnode$state$request.cliente,
        feedback = _vnode$state$request.feedback,
        ordine = _vnode$state$request.ordine,
        status = _vnode$state$request.status; //first push the results to res and when done to inputs to avoid redraws

    var res = [];

    var _loop = function _loop(field) {
      if (field != '_id' && 'id') {
        var value = '';
        var fields = Object.keys(vnode.state.request);
        res.push((0, _mithril.default)('input', {
          class: "req-input request-".concat(field, " request-").concat(_id),
          data: field,
          id: vnode.state.request._id,
          // value: value,
          readonly: field === 'nr' ? true : false,
          oncreate: function oncreate(e) {
            e.dom.value = vnode.state.request[field]; // console.log(value, vnode.state.request[field]);
          },
          onupdate: function onupdate(e) {
            console.log(e);
          },
          // DIFFING
          oninput: function oninput(e) {
            vnode.state.request[field] = e.srcElement.value.toLowerCase();

            if (vnode.state.request[field] != originalRequests[_id][field]) {
              //paint yellow the diffs
              vnode.state.changed = true;
              e.srcElement.classList.add('diffed');
            } else {
              vnode.state.changed = false;
              e.srcElement.classList.remove('diffed');
            }

            socket.emit('input', {
              id: vnode.state.request._id,
              field: field,
              value: e.srcElement.value
            });
          },
          onchange: function onchange(e) {
            var field = e.srcElement.getAttribute('data'); // keep track of changes

            if (vnode.state.changed) {
              if (!changes[_id]) {
                changes[_id] = {};
              }

              changes[_id][field] = e.srcElement.value;
            } else if (!vnode.state.changed && changes[_id][field]) {
              delete changes[_id][field];
            }

            console.log(changes);
          }
        }));

        if (field === fields[fields.length - 1]) {
          vnode.state.inputs = res;
        }
      }
    };

    for (var field in vnode.state.request) {
      _loop(field);
    }
  },
  view: function view(vnode) {
    return [// ACTIONS MENU
    (0, _mithril.default)(_constructUi.PopoverMenu, {
      closeOnContentClick: true,
      menuAttrs: {
        size: vnode.state.size,
        fluid: true
      },
      trigger: (0, _mithril.default)(_constructUi.Button, {
        class: "request-".concat(vnode.state.request._id),
        iconLeft: _constructUi.Icons.SETTINGS,
        fluid: true,
        outlined: true
      }),
      content: [(0, _mithril.default)(_constructUi.MenuItem, {
        iconLeft: _constructUi.Icons.CHEVRON_RIGHT,
        label: 'Select Row'
      }), (0, _mithril.default)(_constructUi.MenuItem, {
        label: 'Delete Row',
        iconLeft: _constructUi.Icons.MINUS,
        onclick: function onclick(e) {
          _mithril.default.request({
            method: 'DELETE',
            url: '/api/deleteRequest',
            headers: {
              id: vnode.state.request._id
            }
          }).then(function (res) {
            var removed = requests.splice(requests.indexOf(vnode.state.request), 1);
            console.log(removed);
          });
        }
      })]
    }), vnode.state.inputs];
  }
};
var Richieste = {
  filter: {},
  requests: [],
  updated: false,
  filteredRequests: [],
  getRequests: function getRequests() {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _mithril.default.request({
                url: '/api/listRequests'
              }).then(function (res) {
                Object.values(res).forEach(function (req) {
                  originalRequests[req._id] = {};
                  originalRequests[req._id] = JSON.parse(JSON.stringify(req));
                });
                requests = res; // clear the DIFFS

                clearDiffs();
              });

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  getDate: function getDate() {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getYear() - 100;
    var date = "".concat(day, ".").concat(month, ".").concat(year);
    return date;
  },
  addRow: function addRow() {
    console.log('adding row');

    _mithril.default.request({
      url: '/api/newRequest',
      headers: {
        day: Richieste.getDate(),
        user: 'ntaov'
      }
    }).then(function (res) {
      requests.push({
        _id: res._id,
        nr: '',
        date: Richieste.getDate(),
        season: "",
        line: "",
        model: "",
        color: "",
        size: "",
        user: 'ntaov',
        client: "",
        feedback: "",
        order: "",
        status: 'n/a'
      });
    });

    console.log(requests);
  },
  filterRequests: function filterRequests(requests, filter) {
    var res = [];
    Object.filter(requests, filter).forEach(function (item, i) {
      // push the data to Sets for the filtering checkboxes
      addToSets(item);
      res.push((0, _mithril.default)(Request, {
        request: item,
        index: i,
        key: item._id
      }));
    });
    return res;
  },
  oninit: function oninit(vnode) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              headers.forEach(function (field, i) {
                vnode.state.filter[field] = null;
              });
              _context2.next = 3;
              return vnode.state.getRequests();

            case 3:
              vnode.state.filteredRequests = [];

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  view: function view(vnode) {
    console.log('drawing requests');
    vnode.state.filteredRequests = vnode.state.filterRequests(requests, vnode.state.filter); // console.log(vnode.state.filter, vnode.state.filteredRequests);

    return (0, _mithril.default)('.requests-component', [(0, _mithril.default)(_Nav.Nav), (0, _mithril.default)(".requests-wrapper.container", [(0, _mithril.default)("h1", "Richieste Solomeo"), (0, _mithril.default)(MenuComponent), (0, _mithril.default)('.table', [(0, _mithril.default)(Headers, {
      k: vnode.state.filterRequests
    }), vnode.state.filteredRequests])])]);
  }
};
exports.Richieste = Richieste;
},{"mithril":"../node_modules/mithril/index.js","socket.io-client":"../node_modules/socket.io-client/build/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js","./Nav":"components/Nav.js"}],"noSaleAI20.js":[function(require,module,exports) {
exports.NOSALE = ["M2200100C058B", "M2200100C077A", "M2200100CA709", "M2200100CB450", "M2200100CG217", "M2200100CH101", "M2200100CK773", "M2200100CS396", "M2200100CV627", "M2200100CW425", "M2200100CZ621", "M2200124C077A", "M2200124CA709", "M2200124CG217", "M2200124CK773", "M2200124CS396", "M2200124CW425", "M2200124CZ621", "M2200124YC077A", "M2200124YCA709", "M2200124YCG217", "M2200124YCK773", "M2200124YCS396", "M2200124YCW425", "M2200124YCZ621", "M2200162C058B", "M2200162C077A", "M2200162CA709", "M2200162CB450", "M2200162CG217", "M2200162CH101", "M2200162CK773", "M2200162CS396", "M2200162CV627", "M2200162CW425", "M2200162CZ621", "M2200162YC058B", "M2200162YC077A", "M2200162YCA709", "M2200162YCB450", "M2200162YCG217", "M2200162YCH101", "M2200162YCK773", "M2200162YCS396", "M2200162YCV627", "M2200162YCW425", "M2200162YCZ621", "M2300100CA433", "M2300100CG217", "M2300100CW425", "M2300106CG217", "M2300106CW425", "M2300162CA433", "M2300162CG217", "M2300162CW425", "M2400100CD408", "M2400100CH101", "M2400100CR73", "M2400100CW425", "M2400106CD408", "M2400106CR73", "M2400106YCD408", "M2400106YCR73", "M2400162CD408", "M2400162CH101", "M2400162CR73", "M2400162YCD408", "M2400162YCH101", "M2400162YCR73", "M2Q00100CA709", "M2Q00100CB450", "M2Q00100CC341", "M2Q00100CD552", "M2Q00100CG633", "M2Q00100CH101", "M2Q00100CH216", "M2Q00100CS396", "M2Q00100CU570", "M2Q00100CU992", "M2Q00100CW425", "M2Q00100CY836", "M2Q00106CA709", "M2Q00106CG633", "M2Q00106CS396", "M2Q00106CW425", "M2Q00106CY836", "M2Q00124CA709", "M2Q00124CD552", "M2Q00124CG633", "M2Q00124CS396", "M2Q00124CU570", "M2Q00124CU992", "M2Q00124CW425", "M2Q00124CY836", "M2Q00162CA709", "M2Q00162CB450", "M2Q00162CC341", "M2Q00162CD552", "M2Q00162CG633", "M2Q00162CH216", "M2Q00162CS396", "M2Q00162CU570", "M2Q00162CU992", "M2Q00162CW425", "M2Q00162CY836", "EZUBTSJ233CK828", "EZUCOBB946C7653", "M032P0018C078", "M032P0018C079", "M032P0018C202", "M032P0018YC078", "M032P0018YC079", "M032P0018YC202", "M032PI1770C079", "M032PI1770C263", "M032PI177YC079", "M032PI177YC263", "M0T313212GC092", "M0T313243GC092", "M0T313263GC038", "M0T319069GC038", "M0T319069GC092", "M0T319069YC038", "M0T611308C3657", "M0T611308C4425", "M0T611308C6159", "M0T611308C8190", "M0T611344C6159", "M0T617467C8190", "M0T639779GCT489", "M0T639779GCX135", "M0T656686C159", "M0T656686C2425", "M0UC40038C159", "M0UC41716C159", "M0UC41718C159", "M0UC41718YC159", "M0Z37D2210C1471", "M0Z37D221YC1471", "M2223246CF423", "M277PD2210C7193", "M277PD2210C7210", "M277PD221YC7193", "M277PD221YC7210", "M289LI1770C2511", "M289LI1770C2517", "M289LI1770C5723", "M289LI1770C5797", "M289LI177YC2511", "M289LI177YC2517", "M289LI177YC5723", "M289LI177YC5797", "M289LV0310C5797", "MAUAL310C5923", "MBZIU243C6608", "ME233E1920C2976", "ME6240091C001", "ME6240091YC001", "ME624S1866C001", "ME645D2210C1471", "ME81UAS20CX949", "MF4147BTDC001", "MF4597BT7C005", "MF4597BT7C079", "MF460AS21CG936", "MF460AS21UCG936", "MHN217BTDC003", "MHN217BTDYC003", "MHN217LTDYC003", "ML4549947C4533", "ML6940038C008", "ML6940068C003", "ML6940068YC003", "ML6941706C003", "ML6941718C008", "ML6941718YC008", "MM4591601CO100", "MQ8588J01C686", "MR4407BTCC003", "MR4409106CQ970", "MR8130003C018", "MR8130003YC018", "MR813S005C018", "MR813S005YC018", "MS6660038C012", "MS6661718C012", "MSC598VSCV395", "MT4361395CQ638", "MT4976265C047", "MT4976265YC047", "MT4976416CL209", "MT4977003C047", "MTU043202GC017", "MTU049069GC017", "MZUBTSJ233CK828", "MZUCHOK971C6491", "MZUCOBB946C7653", "MTS406686C159", "MTS406686C9670", "M0T313202YC038", "M0T313202YCU374", "M0T319069YCU374", "M0T656619YC159", "M0T656619YC2425", "M0T656619YC6134", "M0T711308YC4425", "M0T711308YC6159", "M0T711308YC8190", "M0T711344YC4425", "M0T711344YC6159", "M0T711344YC8190", "M0T739749YC6134", "M0T739749YC6159", "M0T739749YC9300", "M0T756686YC159", "M0T756686YC2425", "M0UC40068YC159", "M0UC40068YC735", "M0Z37D221YC1463", "M0Z37D221YC1469", "M0Z37X234YC1470", "M2200124YCA058", "M2200124YCB119", "M2200124YCX822", "M2200162YCA058", "M2200162YCB119", "M2209218YC058B", "M2209218YCA058", "M2209218YCX390", "M2223218YCS396", "M2223218YCU715", "M2223218YCY162", "M2223246YCS396", "M2223246YCU715", "M2223246YCY162", "M2400106YCJ917", "M2400106YCW425", "M2400124YCA058", "M2400124YCF423", "M2400150YCA433", "M2400150YCW425", "M2400162YC079C", "M2400162YCY305", "M277PD221YC6009", "M277PD221YC7300", "M277PJ201YC6009", "M277PJ201YC7210", "M277PJ201YC7300", "M289LE145YC5918", "M289LI177YC2501", "M289LI177YC5002", "ME624S183YCD114", "ME624S183YCF783", "MF4237BT7UC006", "MF4237BT7UC018", "MF460AS21UCD781", "MG4596344YCW661", "MHN217BT7UC064", "MHN217BTDYC007", "MHN217LTDYC007", "MM4591632YCO100", "MR4407BTDYC003", "MR4407BTDYC014", "MR8130003YC004", "MT32P1187YCE262", "EZUCOBB943C7654", "EZUCOBB946C7656", "EZUSIBJ233CO795", "M032P0018C263", "M032P0018C795", "M032P0018YC263", "M032P0018YC795", "M032P7BT7AC078", "M032P7BTZC079", "M074PD2050C1471", "M074PX2340C1468", "M074PX2340C1470", "M074PX2340C1471", "M075M0028C014", "M075M0038C014", "M075M0068C006", "M075M0068C403", "M075M1706C014", "M075M1716C014", "M075M1718C001", "M075M1718C014", "M075M1718C035", "M0H43C3000C1484", "M0H43C3000C1489", "M0H43C3000C1490", "M0H43D2210C1484", "M0H43D2210C1489", "M0H43D2210C1490", "M0H43J2010C1484", "M0H43J2010C1489", "M0H43J2010C1490", "M0H43J201NC1484", "M0H43J201NC1489", "M0H43J201NC1490", "M0H43X1290C1484", "M0H43X1290C1489", "M0H43X1290C1490", "M0PCL9978C6536", "M0T153202GC6134", "M0T153212GC6134", "M0T153233GC6134", "M0T159069GC6134", "M0T159069GC7220", "M0T313202GC038", "M0T313202GC039", "M0T313202GC093", "M0T313202GC094", "M0T313202YC039", "M0T313202YC093", "M0T313202YC094", "M0T313212GC039", "M0T313212GC049", "M0T313212GC093", "M0T313212GC094", "M0T313222GC039", "M0T313222GC049", "M0T313222GC093", "M0T313222GC094", "M0T313233GC038", "M0T313233GC039", "M0T313233GC093", "M0T313233GC094", "M0T313233YC038", "M0T313242GC039", "M0T313242GC093", "M0T313242GC094", "M0T313243GC039", "M0T313243GC093", "M0T313263GC039", "M0T313263GC049", "M0T313263GC093", "M0T313263GC094", "M0T319060GC039", "M0T319069GC039", "M0T319069GC049", "M0T319069GC093", "M0T319069GC094", "M0T319069YC039", "M0T319069YC049", "M0T319069YC093", "M0T319069YC094", "M0T319072GC039", "M0T319072GC093", "M0T319072GC094", "M0T319079GC039", "M0T319079GC049", "M0T319079GC093", "M0T319079GC094", "M0T353511C080", "M0T353511C3657", "M0T353511C5917", "M0T353511C6134", "M0T353511C6424", "M0T353511C8031", "M0T353511C9300", "M0T611308C080", "M0T611308C6134", "M0T611308C6424", "M0T611308C7220", "M0T611308C8080", "M0T611308C8127", "M0T611308C9276", "M0T611308C9300", "M0T611308C9386", "M0T611328GCK096", "M0T611328GCL087", "M0T611328GCL950", "M0T611328GCV362", "M0T611328GCW361", "M0T611328GCX065", "M0T611334CA819", "M0T611334CB440", "M0T611334CE610", "M0T611334CL517", "M0T611334CQ729", "M0T611334CW787", "M0T611334CY887", "M0T611334CY918", "M0T611344C080", "M0T611344C3657", "M0T611344C4425", "M0T611344C6134", "M0T611344C6424", "M0T611344C7220", "M0T611344C8080", "M0T611344C8127", "M0T611344C8190", "M0T611344C9300", "M0T611344C9386", "M0T611620CI580", "M0T613936C080", "M0T613936C3657", "M0T613936C4425", "M0T613936C6134", "M0T613936C6159", "M0T613936C6424", "M0T613936C7220", "M0T613936C8080", "M0T613936C8127", "M0T613936C8190", "M0T613936C9300", "M0T613936C9386", "M0T613966CA819", "M0T613966CB440", "M0T613966CE610", "M0T613966CL517", "M0T613966CQ729", "M0T613966CW787", "M0T613966CY887", "M0T613966CY918", "M0T613976C3657", "M0T617407C080", "M0T617407C3657", "M0T617407C4425", "M0T617407C6134", "M0T617407C6159", "M0T617407C6424", "M0T617407C7220", "M0T617407C8080", "M0T617407C8127", "M0T617407C8190", "M0T617407C9300", "M0T617407C9386", "M0T617423CB440", "M0T617427CA819", "M0T617427CB440", "M0T617427CE490", "M0T617427CE610", "M0T617427CG490", "M0T617427CL517", "M0T617427CQ729", "M0T617427CW787", "M0T617427CY887", "M0T617427CY918", "M0T617427GCE610", "M0T617427GCL517", "M0T617427GCU263", "M0T617427GCW787", "M0T617433CA819", "M0T617433CB440", "M0T617433CE610", "M0T617433CL517", "M0T617433CQ729", "M0T617433CW787", "M0T617433CY887", "M0T617433CY918", "M0T617467C4425", "M0T617467C6134", "M0T617467C8127", "M0T617497C8190", "M0T618357GCW787", "M0T633936C080", "M0T633936C3657", "M0T633936C4425", "M0T633936C6134", "M0T633936C6159", "M0T633936C6424", "M0T633936C7220", "M0T633936C8080", "M0T633936C8127", "M0T633936C8190", "M0T633936C9276", "M0T633936C9300", "M0T633936C9386", "M0T633976C080", "M0T636666C080", "M0T636666C3657", "M0T636666C4425", "M0T636666C6134", "M0T636666C6159", "M0T636666C6424", "M0T636666C7220", "M0T636666C8080", "M0T636666C8190", "M0T636666C9300", "M0T636676C080", "M0T636676C3657", "M0T636676C4425", "M0T636676C6134", "M0T636676C6159", "M0T636676C6424", "M0T636676C7220", "M0T636676C8080", "M0T636676C8190", "M0T636676C9300", "M0T636686C080", "M0T636686C3657", "M0T636686C4425", "M0T636686C6134", "M0T636686C6159", "M0T636686C6424", "M0T636686C7220", "M0T636686C8080", "M0T636686C8190", "M0T636686C9300", "M0T636699C080", "M0T636699C3657", "M0T636699C4425", "M0T636699C6134", "M0T636699C6159", "M0T636699C6424", "M0T636699C7220", "M0T636699C8080", "M0T636699C8190", "M0T636699C9300", "M0T638319C6134", "M0T638319C6159", "M0T638319C9276", "M0T638356C3657", "M0T639769GCD361", "M0T639769GCG817", "M0T639769GCK914", "M0T639769GCO235", "M0T639769GCP839", "M0T639769GCW787", "M0T639769GCX135", "M0T639779GCD361", "M0T639779GCG817", "M0T639779GCK914", "M0T639779GCO235", "M0T639779GCP839", "M0T639779GCV552", "M0T639779GCW787", "M0T656609C6134", "M0T656676C2425", "M0T656676C737", "M0T656686C6134", "M0T656686C737", "M0T656699C159", "M0T711308C080", "M0T711308C3657", "M0T711308C4425", "M0T711308C6134", "M0T711308C6159", "M0T711308C6424", "M0T711308C7220", "M0T711308C8080", "M0T711308C8127", "M0T711308C8190", "M0T711308C9300", "M0T711308C9386", "M0T711308YC080", "M0T711308YC3657", "M0T711308YC6134", "M0T711308YC6424", "M0T711308YC7220", "M0T711308YC8080", "M0T711308YC8127", "M0T711308YC9300", "M0T711308YC9386", "M0T711328GCK096", "M0T711328GCL087", "M0T711328GCL950", "M0T711328GCV362", "M0T711328GCW361", "M0T711328GCX065", "M0T711334CA819", "M0T711334CB440", "M0T711334CE610", "M0T711334CL517", "M0T711334CQ729", "M0T711334CW787", "M0T711334CY887", "M0T711334CY918", "M0T711344C080", "M0T711344C3657", "M0T711344C4425", "M0T711344C6134", "M0T711344C6159", "M0T711344C6424", "M0T711344C7220", "M0T711344C8080", "M0T711344C8127", "M0T711344C8190", "M0T711344C9300", "M0T711344C9386", "M0T711344YC080", "M0T711344YC3657", "M0T711344YC6134", "M0T711344YC6424", "M0T711344YC7220", "M0T711344YC8080", "M0T711344YC8127", "M0T711344YC9300", "M0T711344YC9386", "M0T713936C080", "M0T713936C3657", "M0T713936C4425", "M0T713936C6134", "M0T713936C6159", "M0T713936C6424", "M0T713936C7220", "M0T713936C8080", "M0T713936C8127", "M0T713936C8190", "M0T713936C9300", "M0T713936C9386", "M0T713966CA819", "M0T713966CB440", "M0T713966CE610", "M0T713966CL517", "M0T713966CQ729", "M0T713966CW787", "M0T713966CY887", "M0T713966CY918", "M0T713976C4425", "M0T717407C080", "M0T717407C3657", "M0T717407C4425", "M0T717407C6134", "M0T717407C6159", "M0T717407C6424", "M0T717407C7220", "M0T717407C8080", "M0T717407C8127", "M0T717407C8190", "M0T717407C9300", "M0T717407C9386", "M0T717427CA819", "M0T717427CB440", "M0T717427CE610", "M0T717427CL517", "M0T717427CQ729", "M0T717427CW787", "M0T717427CY887", "M0T717427CY918", "M0T717427GCE610", "M0T717427GCL517", "M0T717427GCU263", "M0T717427GCW787", "M0T717433CA819", "M0T717433CB440", "M0T717433CE610", "M0T717433CL517", "M0T717433CQ729", "M0T717433CW787", "M0T717433CY887", "M0T717433CY918", "M0T733936C080", "M0T733936C3657", "M0T733936C4425", "M0T733936C6134", "M0T733936C6159", "M0T733936C6424", "M0T733936C7220", "M0T733936C8080", "M0T733936C8127", "M0T733936C8190", "M0T733936C9300", "M0T733936C9386", "M0T736676C080", "M0T736676C3657", "M0T736676C4425", "M0T736676C6134", "M0T736676C6159", "M0T736676C6424", "M0T736676C7220", "M0T736676C8080", "M0T736676C8190", "M0T736676C9300", "M0T736686C080", "M0T736686C3657", "M0T736686C4425", "M0T736686C6134", "M0T736686C6159", "M0T736686C6424", "M0T736686C7220", "M0T736686C8080", "M0T736686C8190", "M0T736686C9300", "M0T739769GCD361", "M0T739769GCG817", "M0T739769GCO235", "M0T739769GCP839", "M0T739769GCW787", "M0T739769GCX135", "M0T739779GCD361", "M0T739779GCG817", "M0T739779GCO235", "M0T739779GCP839", "M0T739779GCW787", "M0T739779GCX135", "M0T756686C159", "M0T756686C2425", "M0T756686C6134", "M0T756686C737", "M0T756686YC6134", "M0T756686YC737", "M0UC40028C038", "M0UC40028C159", "M0UC40028C735", "M0UC40038C038", "M0UC40038C735", "M0UC40068C038", "M0UC40068C159", "M0UC40068C735", "M0UC40068YC038", "M0UC41706C159", "M0UC41716C038", "M0UC41716C735", "M0UC41718C038", "M0UC41718C735", "M0UC41718YC038", "M0UC41718YC735", "M0UC43008C038", "M0UC43008C159", "M0UC43008C735", "M0UC43029C038", "M0UC43029C159", "M0UC43029C735", "M0UC43038C038", "M0UC43038C159", "M0UC43038C735", "M0UC43058C038", "M0UC44008C735", "M0Z376844C1470", "M0Z376844C1471", "M0Z376844C1478", "M0Z37C3000C1468", "M0Z37C3000C1470", "M0Z37C3000C1471", "M0Z37C3000C1478", "M0Z37C3010C1470", "M0Z37D2050C1470", "M0Z37D2210C1468", "M0Z37D2210C1469", "M0Z37D2210C1470", "M0Z37D2210C1478", "M0Z37D221YC1468", "M0Z37D221YC1470", "M0Z37D221YC1478", "M0Z37D2360C1468", "M0Z37D2360C1470", "M0Z37X1290C1468", "M0Z37X1290C1470", "M0Z37X1290C1471", "M0Z37X1290C1478", "M0Z37X2340C1468", "M0Z37X2340C1470", "M0Z37X2340C1471", "M0Z37X2340C1478", "M0Z37X234YC1468", "M0Z37X234YC1471", "M0Z37X234YC1478", "M2200100CA058", "M2200100CB107", "M2200100CC341", "M2200100CC687", "M2200100CO312", "M2200100CO567", "M2200100CP624", "M2200100CY836", "M2200106C058B", "M2200106C077A", "M2200106CA058", "M2200106CA709", "M2200106CB450", "M2200106CC341", "M2200106CC687", "M2200106CH101", "M2200106CK773", "M2200106CO312", "M2200106CP624", "M2200106CS396", "M2200106CV627", "M2200106CW425", "M2200106CY836", "M2200106CZ621", "M2200124CA058", "M2200124CB450", "M2200124CC341", "M2200124CC687", "M2200124CH101", "M2200124CO312", "M2200124CP624", "M2200124CV627", "M2200124CY836", "M2200124YCB450", "M2200124YCC341", "M2200124YCC687", "M2200124YCH101", "M2200124YCO312", "M2200124YCP624", "M2200124YCV627", "M2200124YCY836", "M2200132CA058", "M2200162CA058", "M2200162CC341", "M2200162CC687", "M2200162CO312", "M2200162CP624", "M2200162CY836", "M2200162YCC341", "M2200162YCC687", "M2200162YCO312", "M2200162YCP624", "M2200162YCY836", "M2209218C058B", "M2209218CA058", "M2209218CB450", "M2209218CK773", "M2209218CO312", "M2209218CS396", "M2209218CV627", "M2209218YCB450", "M2209218YCK773", "M2209218YCO312", "M2209218YCS396", "M2209218YCV627", "M2213003CV927", "M2223246CB450", "M2223246CK773", "M2223246CO312", "M2223246CS396", "M2223246CU715", "M2223246CV627", "M2223246CW425", "M2223246CY162", "M2223246YCB450", "M2223246YCK773", "M2223246YCO312", "M2223246YCV627", "M2223246YCW425", "M2229510CA058", "M2254909CK305", "M225P116CT160", "M225P126CV030", "M225P129CI839", "M225P129CZ157", "M22700610CY921", "M2300100CA709", "M2300100CD408", "M2300100CJ917", "M2300100CO218", "M2300100CR73", "M2300100CS170", "M2300100CS477", "M2300106CD408", "M2300106CJ917", "M2300106CO218", "M2300106CR73", "M2300106CS170", "M2300106CS477", "M2300150CA709", "M2300150CD408", "M2300150CJ917", "M2300150CO218", "M2300150CS170", "M2300150CS477", "M2300162CD408", "M2300162CJ917", "M2300162CO218", "M2300162CR73", "M2300162CS477", "M2300295CD408", "M2300295CJ917", "M2300295CO218", "M2300295CR73", "M2300295CS477", "M2300295CW425", "M2381310CD408", "M2381310CJ917", "M2381310CO218", "M2381310CR73", "M2381310CS477", "M2381310CW425", "M2385156CD408", "M2385156CJ917", "M2385156CO218", "M2385156CR73", "M2385156CS477", "M2385156CW425", "M2400100CB676", "M2400100CJ917", "M2400100CO218", "M2400100CS477", "M2400106CJ917", "M2400106CO218", "M2400106CS477", "M2400106CW425", "M2400106YCO218", "M2400106YCS477", "M2400124YCD408", "M2400124YCJ917", "M2400124YCO218", "M2400124YCR73", "M2400124YCS477", "M2400124YCW425", "M2400150CA433", "M2400150CW425", "M2400162CA709", "M2400162CB676", "M2400162CJ917", "M2400162CO218", "M2400162CS477", "M2400162CW425", "M2400162YCA709", "M2400162YCB676", "M2400162YCJ917", "M2400162YCO218", "M2400162YCS477", "M2400162YCW425", "M2400295CD408", "M2400295CJ917", "M2400295CO218", "M2400295CR73", "M2400295CS477", "M2400295CW425", "M2481310CD408", "M2481310CJ917", "M2481310CO218", "M2481310CR73", "M2481310CS477", "M2481310CW425", "M2485156CD408", "M2485156CJ917", "M2485156CO218", "M2485156CR73", "M2485156CS477", "M2485156CW425", "M252DE1920C5002", "M252DS2080C2200", "M262PC3000C6004", "M262PC3000C6094", "M262PC3000C7172", "M262PC3000C7193", "M262PC3000C7210", "M262PD2210C6004", "M262PD2210C6094", "M262PD2210C7172", "M262PD2210C7193", "M262PD2210C7210", "M262PD2360C6004", "M262PD2360C6094", "M262PD2360C7172", "M262PD2360C7193", "M262PD2360C7210", "M262PX1290C6004", "M262PX1290C6094", "M262PX1290C7172", "M262PX1290C7193", "M262PX1290C7210", "M262PX2340C6004", "M262PX2340C6094", "M262PX2340C7172", "M262PX2340C7193", "M262PX2340C7210", "M269DE1460C2200", "M269DE1460C2517", "M269DE1460C5723", "M269DE1460C5797", "M269DE1890C2200", "M269DE1890C2517", "M269DE1890C5723", "M269DE1890C5797", "M269DV0310C2200", "M269DV0310C2517", "M274DB1770C2200", "M274DB1770C2515", "M274DB1770C2517", "M274DB1770C5723", "M274DB1770C5797", "M274DB1780C2200", "M274DB1780C2515", "M274DB1780C2517", "M274DB1780C5723", "M274DB1780C5797", "M274DE1450C2200", "M274DE1450C2515", "M274DE1450C2517", "M274DE1450C5723", "M274DE1450C5797", "M274DE1460C2200", "M274DE1460C2515", "M274DE1460C2517", "M274DE1460C5723", "M274DE1460C5797", "M274DE1730C2200", "M274DE1730C2515", "M274DE1730C2517", "M274DE1730C5723", "M274DE1730C5797", "M274DE1740C2200", "M274DE1740C2515", "M274DE1740C2517", "M274DE1740C5723", "M274DE1740C5797", "M274DE1890C2200", "M274DE1890C2515", "M274DE1890C2517", "M274DE1890C5723", "M274DE1890C5797", "M274DE1920C2200", "M274DE1920C2515", "M274DE1920C2517", "M274DE1920C5723", "M274DE1920C5797", "M274DI1770C2200", "M274DI1770C2515", "M274DI1770C2517", "M274DI1770C5723", "M274DI1770C5797", "M274DI1780C2200", "M274DI1780C2515", "M274DI1780C2517", "M274DI1780C5723", "M274DI1780C5797", "M274DL1030C2200", "M274DL1030C2515", "M274DL1030C2517", "M274DL1030C5723", "M274DL1030C5797", "M274DS1950C2200", "M274DS1950C2515", "M274DS1950C2517", "M274DS1950C5723", "M274DS1950C5797", "M274DS2160C2200", "M274DS2160C2515", "M274DS2160C2517", "M274DS2160C5723", "M274DS2160C5797", "M277PC3000C7210", "M277PD2210C6004", "M277PD2210C6009", "M277PD2210C6094", "M277PD2210C7172", "M277PD2210C7300", "M277PD221YC6004", "M277PD221YC6094", "M277PD221YC7172", "M277PJ2010C6004", "M277PJ2010C6009", "M277PJ2010C6094", "M277PJ2010C7172", "M277PJ2010C7193", "M277PJ2010C7210", "M277PJ2010C7300", "M277PJ201YC6004", "M277PJ201YC6094", "M277PJ201YC7172", "M277PJ201YC7193", "M277PJ2020C6004", "M277PJ2020C6094", "M277PJ2020C7172", "M277PJ2020C7193", "M277PJ2020C7210", "M277PX1290C6004", "M277PX1290C6094", "M277PX1290C7172", "M277PX1290C7193", "M277PX1290C7210", "M277PX2340C6004", "M277PX2340C6094", "M277PX2340C7172", "M277PX2340C7193", "M277PX2340C7210", "M279DB1770C2200", "M279DB1770C2517", "M279DB1770C5723", "M279DB1770C5797", "M279DB1780C2200", "M279DB1780C2517", "M279DB1780C5723", "M279DB1780C5797", "M279DE1450C2200", "M279DE1450C2517", "M279DE1450C5723", "M279DE1450C5797", "M279DE1460C2200", "M279DE1460C2517", "M279DE1460C5723", "M279DE1460C5797", "M279DE1730C2200", "M279DE1730C2517", "M279DE1730C5723", "M279DE1730C5797", "M279DE1740C2200", "M279DE1740C2517", "M279DE1740C5723", "M279DE1740C5797", "M279DE1890C2200", "M279DE1890C2517", "M279DE1890C5723", "M279DE1890C5797", "M279DE1920C2200", "M279DE1920C2517", "M279DE1920C5723", "M279DE1920C5797", "M279DI1770C2200", "M279DI1770C2517", "M279DI1770C5723", "M279DI1770C5797", "M279DI1780C2200", "M279DI1780C2517", "M279DI1780C5723", "M279DI1780C5797", "M279DL1030C2200", "M279DL1030C2517", "M279DL1030C5723", "M279DL1030C5797", "M279DS1950C2200", "M279DS1950C2517", "M279DS1950C5723", "M279DS1950C5797", "M279DS2160C2200", "M279DS2160C2517", "M279DS2160C5723", "M279DS2160C5797", "M283PD2210C1468", "M283PD2210C1470", "M283PD2210C1471", "M283PJ2010C1468", "M283PJ2010C1470", "M283PJ2010C1471", "M283PJ2020C1468", "M283PJ2020C1470", "M283PX1290C1468", "M283PX1290C1470", "M283PX1290C1471", "M283PZ2030C1468", "M283PZ2030C1470", "M283PZ2030C1471", "M283PZ2040C1468", "M283PZ2040C1470", "M283PZ2040C1471", "M283PZ2050C1468", "M2872796CA058", "M2872796CP646", "M288PD2210C1472", "M288PJ2010C1472", "M288PX1290C1472", "M289LB1770C2517", "M289LB1770C5723", "M289LB1770C5797", "M289LB1780C2517", "M289LB1780C5723", "M289LB1780C5797", "M289LE1450C2517", "M289LE1450C5723", "M289LE1450C5797", "M289LE1450C5917", "M289LE1450C5918", "M289LE145YC2517", "M289LE145YC5723", "M289LE145YC5797", "M289LE145YC5917", "M289LE1460C2517", "M289LE1460C5002", "M289LE1460C5723", "M289LE1460C5797", "M289LE1460C5918", "M289LE1730C2517", "M289LE1730C5723", "M289LE1730C5797", "M289LE1740C2517", "M289LE1740C5723", "M289LE1740C5797", "M289LE1740C5918", "M289LE1890C2517", "M289LE1890C5002", "M289LE1890C5723", "M289LE1890C5797", "M289LE1890C5918", "M289LE1920C2515", "M289LE1920C2517", "M289LE1920C5002", "M289LE1920C5723", "M289LE1920C5797", "M289LE1920C5918", "M289LI1770C2501", "M289LI1770C5002", "M289LI1770C5917", "M289LI1770C5918", "M289LI177YC5917", "M289LI177YC5918", "M289LI1780C2517", "M289LI1780C5723", "M289LI1780C5797", "M289LI1780C5918", "M289LL1030C2517", "M289LL1030C5723", "M289LL1030C5797", "M289LS1950C2517", "M289LS1950C5723", "M289LS1950C5797", "M289LS2160C2517", "M289LS2160C5723", "M289LS2160C5797", "M2900234CW425", "M2Q00100C077A", "M2Q00100CA058", "M2Q00100CB878", "M2Q00100CC687", "M2Q00100CK773", "M2Q00100CP624", "M2Q00100CZ621", "M2Q00106C077A", "M2Q00106CA058", "M2Q00106CB450", "M2Q00106CC341", "M2Q00106CC687", "M2Q00106CH101", "M2Q00106CK773", "M2Q00106CP624", "M2Q00106CZ621", "M2Q00124C077A", "M2Q00124CA058", "M2Q00124CB450", "M2Q00124CC341", "M2Q00124CC687", "M2Q00124CH101", "M2Q00124CK773", "M2Q00124CP624", "M2Q00124CZ621", "M2Q00162C077A", "M2Q00162CA058", "M2Q00162CC687", "M2Q00162CH101", "M2Q00162CK773", "M2Q00162CP624", "M2Q00162CZ621", "M2Q00295C077A", "M2Q00295CA058", "M2Q00295CA709", "M2Q00295CB450", "M2Q00295CC341", "M2Q00295CC687", "M2Q00295CH101", "M2Q00295CK773", "M2Q00295CP624", "M2Q00295CS396", "M2Q00295CW425", "M2Q00295CY836", "M2Q00295CZ621", "M2Q11900C058", "M2Q11900C073", "M2Q11900C074", "M2Q11900C077", "M2Q11900C079", "M2Q11900C101", "M2Q11900C145", "M2Q11900C174", "M2Q11900C2355", "M2Q11900C2425", "M2Q11900C2642", "M2Q11900C2719", "M2Q11900C2723", "M2Q11900C9080", "M2Q11900C9248", "M2Q11900C9352", "M2Q11900C9388", "M2Q11900C9392", "MA6081716C017", "MA6081718C017", "MAUAL310C8027", "MAUZC327C6074", "MB6140028C013", "MB6140028C019", "MB6140038C013", "MB6140038C019", "MB6140068C013", "MB6140068C019", "MB6141706C013", "MB6141706C019", "MB6141716C013", "MB6141716C019", "MB6141718C013", "MB6141718C019", "MB6143008C013", "MB6143008C019", "MB6143029C013", "MBZIU071C6608", "MBZIU258C6608", "MBZIU342C6608", "MBZIU351C6608", "MBZIU391C6608", "MD4107BBDC002", "MD4107BBDC006", "MD4107BBDC087", "MD4107BBDAC002", "MD4107BBDAC006", "MD4107BBDAC087", "MD4107BBDBC002", "MD4107BBDBC006", "MD4107BBDBC087", "MD4107BBDDC002", "MD4107BBDDC006", "MD4107BBDDC087", "MD4107BBDMC002", "MD4107BBDMC006", "MD4107BBDMC087", "MD4107BBDNC002", "MD4107BBDNC006", "MD4107BBDNC087", "MD4107BBDRC002", "MD4107BBDRC006", "MD4107BBDRC087", "MD4107BBDVC002", "MD4107BBDVC006", "MD4107BBDVC087", "MD4107BFDC002", "MD4107BFDC006", "MD4107BFDC087", "MD4107BFDAC002", "MD4107BFDAC006", "MD4107BFDAC087", "MD4107BFDBC002", "MD4107BFDBC006", "MD4107BFDBC087", "MD4107BFDDC002", "MD4107BFDDC006", "MD4107BFDDC087", "MD4107BFDMC002", "MD4107BFDMC006", "MD4107BFDMC087", "MD4107BFDNC002", "MD4107BFDNC006", "MD4107BFDNC087", "MD4107BFDRC002", "MD4107BFDRC006", "MD4107BFDRC087", "MD4107BFDVC002", "MD4107BFDVC006", "MD4107BFDVC087", "MD4107BNDC002", "MD4107BNDC006", "MD4107BNDC087", "MD4107BNDAC002", "MD4107BNDAC006", "MD4107BNDAC087", "MD4107BNDBC002", "MD4107BNDBC006", "MD4107BNDBC087", "MD4107BNDDC002", "MD4107BNDDC006", "MD4107BNDDC087", "MD4107BNDMC002", "MD4107BNDMC006", "MD4107BNDMC087", "MD4107BNDNC002", "MD4107BNDNC006", "MD4107BNDNC087", "MD4107BNDRC002", "MD4107BNDRC006", "MD4107BNDRC087", "MD4107BNDVC002", "MD4107BNDVC006", "MD4107BNDVC087", "MD4107BPDC002", "MD4107BPDC006", "MD4107BPDC087", "MD4107BPDAC002", "MD4107BPDAC006", "MD4107BPDAC087", "MD4107BPDBC002", "MD4107BPDBC006", "MD4107BPDBC087", "MD4107BPDDC002", "MD4107BPDDC006", "MD4107BPDDC087", "MD4107BPDMC002", "MD4107BPDMC006", "MD4107BPDMC087", "MD4107BPDNC002", "MD4107BPDNC006", "MD4107BPDNC087", "MD4107BPDRC002", "MD4107BPDRC006", "MD4107BPDRC087", "MD4107BPDVC002", "MD4107BPDVC006", "MD4107BPDVC087", "MD4107BT7C002", "MD4107BT7C006", "MD4107BT7C087", "MD4107BT7AC002", "MD4107BT7AC006", "MD4107BT7AC087", "MD4107BTCC002", "MD4107BTCC006", "MD4107BTCC087", "MD4107BTCAC002", "MD4107BTCAC006", "MD4107BTCAC087", "MD4107BTDC002", "MD4107BTDC006", "MD4107BTDC087", "MD4107BTDAC002", "MD4107BTDAC006", "MD4107BTDAC087", "MD4107BTDBC002", "MD4107BTDBC006", "MD4107BTDBC087", "MD4107BTDDC002", "MD4107BTDDC006", "MD4107BTDDC087", "MD4107BTDMC002", "MD4107BTDMC006", "MD4107BTDMC087", "MD4107BTDNC002", "MD4107BTDNC006", "MD4107BTDNC087", "MD4107BTDRC002", "MD4107BTDRC006", "MD4107BTDRC087", "MD4107BTDVC002", "MD4107BTDVC006", "MD4107BTDVC087", "MD4107BTZC002", "MD4107BTZC006", "MD4107BTZC087", "MD4107BTZAC002", "MD4107BTZAC006", "MD4107BTZAC087", "MD4107BWDC002", "MD4107BWDC006", "MD4107BWDC087", "MD4107BWDAC002", "MD4107BWDAC006", "MD4107BWDAC087", "MD4107BWDBC002", "MD4107BWDBC006", "MD4107BWDBC087", "MD4107BWDDC002", "MD4107BWDDC006", "MD4107BWDDC087", "MD4107BWDMC002", "MD4107BWDMC006", "MD4107BWDMC087", "MD4107BWDNC002", "MD4107BWDNC006", "MD4107BWDNC087", "MD4107BWDRC002", "MD4107BWDRC006", "MD4107BWDRC087", "MD4107BWDVC002", "MD4107BWDVC006", "MD4107BWDVC087", "MD4107GDDC002", "MD4107GDDC006", "MD4107GDDC087", "MD4107GDDAC002", "MD4107GDDAC006", "MD4107GDDAC087", "MD4107GDDBC002", "MD4107GDDBC006", "MD4107GDDBC087", "MD4107GDDDC002", "MD4107GDDDC006", "MD4107GDDDC087", "MD4107GDDMC002", "MD4107GDDMC006", "MD4107GDDMC087", "MD4107GDDNC002", "MD4107GDDNC006", "MD4107GDDNC087", "MD4107GDDRC002", "MD4107GDDRC006", "MD4107GDDRC087", "MD4107GDDVC002", "MD4107GDDVC006", "MD4107GDDVC087", "MD410L00HC002", "MD410L00HC006", "MD410L00HC087", "MD410LDBHC002", "MD410LDBHC006", "MD410LDBHC087", "MD410LDBHAC002", "MD410LDBHAC006", "MD410LDBHAC087", "MD410LDWHC002", "MD410LDWHC006", "MD410LDWHC087", "MD410LDWHAC002", "MD410LDWHAC006", "MD410LDWHAC087", "MD410PA07C002", "MD410PA07C006", "MD410PA07C087", "MD410PA0ZC002", "MD410PA0ZC006", "MD410PA0ZC087", "MD4557BBDC001", "MD4557BBDC007", "MD4557BBDAC001", "MD4557BBDAC007", "MD4557BNDC001", "MD4557BNDC007", "MD4557BNDAC001", "MD4557BNDAC007", "MD4557BT7C001", "MD4557BT7C007", "MD4557BT7AC001", "MD4557BT7AC007", "MD4557BTCC001", "MD4557BTCC007", "MD4557BTCAC001", "MD4557BTCAC007", "MD4557BTZC001", "MD4557BTZC007", "MD4557BTZAC001", "MD4557BTZAC007", "MD4557BWDC001", "MD4557BWDC007", "MD4557BWDAC001", "MD4557BWDAC007", "MD455L00HC001", "MD455L00HC007", "MD455PA07C001", "MD455PA07C007", "MD455PA0ZC001", "MD455PA0ZC007", "MD4677BBDC009", "MD4677BBDC011", "MD4677BBDAC009", "MD4677BBDAC011", "MD4677BNDC009", "MD4677BNDC011", "MD4677BNDAC009", "MD4677BNDAC011", "MD4677BT7C009", "MD4677BT7C011", "MD4677BT7AC009", "MD4677BT7AC011", "MD4677BTCC009", "MD4677BTCC011", "MD4677BTCAC009", "MD4677BTCAC011", "MD4677BTZC009", "MD4677BTZC011", "MD4677BTZAC009", "MD4677BTZAC011", "MD4677BWDC009", "MD4677BWDC011", "MD4677BWDAC009", "MD4677BWDAC011", "MD467L00HC009", "MD467L00HC011", "MD467PA07C009", "MD467PA07C011", "MD467PA0ZC009", "MD467PA0ZC011", "MD8800091CV420", "ME228D2220C1468", "ME228D2220C1470", "ME228D2220C1471", "ME228X1900C1468", "ME228X1900C1470", "ME228X1900C1471", "ME245C3000C1482", "ME245C3000C1483", "ME245D2210C1482", "ME245D2210C1483", "ME245X1290C1482", "ME245X1290C1483", "ME245X2340C1482", "ME245X2340C1483", "ME246D2210C1468", "ME246D2210C1470", "ME246D2210C1471", "ME246J2010C1468", "ME246J2010C1470", "ME246J2010C1471", "ME246J2020C1468", "ME246J2020C1470", "ME246J2020C1471", "ME246X1290C1468", "ME246X1290C1470", "ME246X1290C1471", "ME6240028C001", "ME6240038C001", "ME6240068C001", "ME6241716C001", "ME6241718C001", "ME6243008C001", "ME6243029C001", "ME6243038C001", "ME624S1836CD760", "ME624S1836CF783", "ME624S183YCD760", "ME624S1866CD114", "ME624S1866CF783", "ME624S1866CI338", "ME624S1876CD114", "ME624S1876CF783", "ME624S1876CI338", "ME624S1886CD114", "ME624S1886CF783", "ME624S1886CI338", "ME624S1896CD114", "ME624S1896CF783", "ME624S1896CI338", "ME6454008C4065", "ME6454008CL366", "ME6454008CW911", "ME6454078C4065", "ME6454078CL366", "ME6454078CW911", "ME645D2210C1468", "ME645D2210C1470", "ME645X1290C1468", "ME645X1290C1470", "ME645X1290C1471", "ME645X2340C1468", "ME645X2340C1470", "ME645X2340C1471", "ME81UPS99CX949", "MF4237BTCUC006", "MF4237BTCUC018", "MF423PA07UC006", "MF423PA07UC018", "MF4507BBDC001", "MF4507BBDC074", "MF4507BBDC176", "MF4507BBDC233", "MF4507BBDC276", "MF4507BBDAC001", "MF4507BBDAC074", "MF4507BBDAC176", "MF4507BBDAC233", "MF4507BBDAC276", "MF4507BNDC001", "MF4507BNDC074", "MF4507BNDC176", "MF4507BNDC233", "MF4507BNDC276", "MF4507BNDAC001", "MF4507BNDAC074", "MF4507BNDAC176", "MF4507BNDAC233", "MF4507BNDAC276", "MF4507BT7C001", "MF4507BT7C074", "MF4507BT7C176", "MF4507BT7C233", "MF4507BT7C276", "MF4507BT7AC001", "MF4507BT7AC074", "MF4507BT7AC176", "MF4507BT7AC233", "MF4507BT7AC276", "MF4507BTCC001", "MF4507BTCC074", "MF4507BTCC176", "MF4507BTCC233", "MF4507BTCC276", "MF4507BTCAC001", "MF4507BTCAC074", "MF4507BTCAC176", "MF4507BTCAC233", "MF4507BTCAC276", "MF4507BTZC001", "MF4507BTZC074", "MF4507BTZC176", "MF4507BTZC233", "MF4507BTZC276", "MF4507BTZAC001", "MF4507BTZAC074", "MF4507BTZAC176", "MF4507BTZAC233", "MF4507BTZAC276", "MF4507BWDC001", "MF4507BWDC074", "MF4507BWDC176", "MF4507BWDC233", "MF4507BWDC276", "MF4507BWDAC001", "MF4507BWDAC074", "MF4507BWDAC176", "MF4507BWDAC233", "MF4507BWDAC276", "MF450L00HC001", "MF450L00HC074", "MF450L00HC176", "MF450L00HC233", "MF450L00HC276", "MF450PA07C001", "MF450PA07C074", "MF450PA07C176", "MF450PA07C233", "MF450PA07C276", "MF450PA0ZC001", "MF450PA0ZC074", "MF450PA0ZC176", "MF450PA0ZC233", "MF450PA0ZC276", "MF4597BBDC003", "MF4597BBDC005", "MF4597BBDC059", "MF4597BBDC079", "MF4597BBDC144", "MF4597BBDC240", "MF4597BBDAC003", "MF4597BBDAC005", "MF4597BBDAC059", "MF4597BBDAC079", "MF4597BBDAC144", "MF4597BBDAC240", "MF4597BNDC003", "MF4597BNDC005", "MF4597BNDC059", "MF4597BNDC079", "MF4597BNDC144", "MF4597BNDC240", "MF4597BNDAC003", "MF4597BNDAC005", "MF4597BNDAC059", "MF4597BNDAC079", "MF4597BNDAC144", "MF4597BNDAC240", "MF4597BT7C003", "MF4597BT7C059", "MF4597BT7C144", "MF4597BT7C240", "MF4597BT7AC003", "MF4597BT7AC005", "MF4597BT7AC059", "MF4597BT7AC079", "MF4597BT7AC144", "MF4597BT7AC240", "MF4597BTCC003", "MF4597BTCC005", "MF4597BTCC059", "MF4597BTCC079", "MF4597BTCC144", "MF4597BTCC240", "MF4597BTCAC003", "MF4597BTCAC005", "MF4597BTCAC059", "MF4597BTCAC079", "MF4597BTCAC144", "MF4597BTCAC240", "MF4597BTZC003", "MF4597BTZC005", "MF4597BTZC059", "MF4597BTZC079", "MF4597BTZC144", "MF4597BTZC240", "MF4597BTZAC003", "MF4597BTZAC005", "MF4597BTZAC059", "MF4597BTZAC079", "MF4597BTZAC144", "MF4597BTZAC240", "MF4597BWDC003", "MF4597BWDC005", "MF4597BWDC059", "MF4597BWDC079", "MF4597BWDC144", "MF4597BWDC240", "MF4597BWDAC003", "MF4597BWDAC005", "MF4597BWDAC059", "MF4597BWDAC079", "MF4597BWDAC144", "MF4597BWDAC240", "MF459L00HC003", "MF459L00HC005", "MF459L00HC059", "MF459L00HC079", "MF459L00HC144", "MF459L00HC240", "MF459PA07C003", "MF459PA07C005", "MF459PA07C059", "MF459PA07C079", "MF459PA07C144", "MF459PA07C240", "MF459PA0ZC003", "MF459PA0ZC005", "MF459PA0ZC059", "MF459PA0ZC079", "MF459PA0ZC144", "MF459PA0ZC240", "MF460AS20C004", "MF460AS20C018", "MF460AS20C101", "MF460AS20CD781", "MF460AS20CE498", "MF460AS20CG689", "MF460AS20CG936", "MF460AS20BC004", "MF460AS20BC018", "MF460AS20BC101", "MF460AS20BCD781", "MF460AS20BCE498", "MF460AS20BCG689", "MF460AS20BCG936", "MF460AS21C004", "MF460AS21C018", "MF460AS21C101", "MF460AS21CD781", "MF460AS21CE498", "MF460AS21CG689", "MF460AS21BC004", "MF460AS21BC018", "MF460AS21BC101", "MF460AS21BCD781", "MF460AS21BCE498", "MF460AS21BCG689", "MF460AS21BCG936", "MF460AS21UC004", "MF460AS21UC018", "MF460AS21UC101", "MF460AS21UCE498", "MF460AS21UCG689", "MF460AS22C004", "MF460AS22C018", "MF460AS22C101", "MF460AS22CD781", "MF460AS22CE498", "MF460AS22CG689", "MF460AS22CG936", "MF460AS22BC004", "MF460AS22BC018", "MF460AS22BC101", "MF460AS22BCD781", "MF460AS22BCE498", "MF460AS22BCG689", "MF460AS22BCG936", "MF460GS03C004", "MF460GS03C018", "MF460GS03C101", "MF460GS03CD781", "MF460GS03CE498", "MF460GS03CG689", "MF460GS03CG936", "MF460GS04C004", "MF460GS04C018", "MF460GS04C101", "MF460GS04CD781", "MF460GS04CE498", "MF460GS04CG689", "MF460GS04CG936", "MF460GS07C004", "MF460GS07C018", "MF460GS07C101", "MF460GS07CD781", "MF460GS07CE498", "MF460GS07CG689", "MF460GS07CG936", "MF460PS98CD781", "MF460PS98CE498", "MF460PS98CG689", "MF460PS98CG936", "MF460PS98CN024", "MF460PS99C004", "MF460PS99C018", "MF460PS99C101", "MF460PS99CD781", "MF460PS99CE498", "MF460PS99CG689", "MF460PS99CG936", "MF460PS99CN024", "MF460S1994CA290", "MG4647BBDC001", "MG4647BBDC002", "MG4647BBDAC001", "MG4647BBDAC002", "MG4647BNDC001", "MG4647BNDC002", "MG4647BNDAC001", "MG4647BNDAC002", "MG4647BT7C001", "MG4647BT7C002", "MG4647BT7AC001", "MG4647BT7AC002", "MG4647BTCC001", "MG4647BTCC002", "MG4647BTCAC001", "MG4647BTCAC002", "MG4647BTZC001", "MG4647BTZC002", "MG4647BTZAC001", "MG4647BTZAC002", "MG4647BWDC001", "MG4647BWDC002", "MG4647BWDAC001", "MG4647BWDAC002", "MG464L00HC001", "MG464L00HC002", "MG464PA07C001", "MG464PA07C002", "MG464PA0ZC001", "MG464PA0ZC002", "MG4657BBDC002", "MG4657BBDC003", "MG4657BBDAC002", "MG4657BBDAC003", "MG4657BNDC002", "MG4657BNDC003", "MG4657BNDAC002", "MG4657BNDAC003", "MG4657BT7C002", "MG4657BT7C003", "MG4657BT7AC002", "MG4657BT7AC003", "MG4657BTCC002", "MG4657BTCC003", "MG4657BTCAC002", "MG4657BTCAC003", "MG4657BTZC002", "MG4657BTZC003", "MG4657BTZAC002", "MG4657BTZAC003", "MG4657BWDC002", "MG4657BWDC003", "MG4657BWDAC002", "MG4657BWDAC003", "MG465L00HC002", "MG465L00HC003", "MG465PA07C002", "MG465PA07C003", "MG465PA0ZC002", "MG465PA0ZC003", "MG4827BBDC001", "MG4827BBDC002", "MG4827BBDC004", "MG4827BBDC248", "MG4827BBDC286", "MG4827BBDAC001", "MG4827BBDAC002", "MG4827BBDAC004", "MG4827BBDAC248", "MG4827BBDAC286", "MG4827BNDC001", "MG4827BNDC002", "MG4827BNDC004", "MG4827BNDC248", "MG4827BNDC286", "MG4827BNDAC001", "MG4827BNDAC002", "MG4827BNDAC004", "MG4827BNDAC248", "MG4827BNDAC286", "MG4827BT7C001", "MG4827BT7C002", "MG4827BT7C004", "MG4827BT7C248", "MG4827BT7C286", "MG4827BT7AC001", "MG4827BT7AC002", "MG4827BT7AC004", "MG4827BT7AC248", "MG4827BT7AC286", "MG4827BTCC001", "MG4827BTCC002", "MG4827BTCC004", "MG4827BTCC248", "MG4827BTCC286", "MG4827BTCAC001", "MG4827BTCAC002", "MG4827BTCAC004", "MG4827BTCAC248", "MG4827BTCAC286", "MG4827BTZC001", "MG4827BTZC002", "MG4827BTZC004", "MG4827BTZC248", "MG4827BTZC286", "MG4827BTZAC001", "MG4827BTZAC002", "MG4827BTZAC004", "MG4827BTZAC248", "MG4827BTZAC286", "MG4827BWDC001", "MG4827BWDC002", "MG4827BWDC004", "MG4827BWDC248", "MG4827BWDC286", "MG4827BWDAC001", "MG4827BWDAC002", "MG4827BWDAC004", "MG4827BWDAC248", "MG4827BWDAC286", "MG482L00HC001", "MG482L00HC002", "MG482L00HC004", "MG482L00HC248", "MG482L00HC286", "MG482PA07C001", "MG482PA07C002", "MG482PA07C004", "MG482PA07C248", "MG482PA07C286", "MG482PA0ZC001", "MG482PA0ZC002", "MG482PA0ZC004", "MG482PA0ZC248", "MG482PA0ZC286", "MG6960028C015", "MG6960028C035", "MG6960038C015", "MG6960038C035", "MG6960068C015", "MG6960068C035", "MG6961716C015", "MG6961716C035", "MG6961718C015", "MG6961718C035", "MG6963008C015", "MG6963008C035", "MG6963029C015", "MG6963029C035", "MH203D2060CG64", "MH203D2220CG64", "MH203D2370CG64", "MH203X1900CG64", "MH203X2350CG64", "MH2127BNDC9830", "MH2127BWDC158", "MH4327BBDC001", "MH4327BBDC003", "MH4327BBDAC001", "MH4327BBDAC003", "MH4327BNDC001", "MH4327BNDC003", "MH4327BNDAC001", "MH4327BNDAC003", "MH4327BT7C001", "MH4327BT7C003", "MH4327BT7AC001", "MH4327BT7AC003", "MH4327BTCC001", "MH4327BTCC003", "MH4327BTCAC001", "MH4327BTCAC003", "MH4327BTZC001", "MH4327BTZC003", "MH4327BTZAC001", "MH4327BTZAC003", "MH4327BWDC001", "MH4327BWDC003", "MH4327BWDAC001", "MH4327BWDAC003", "MH432L00HC001", "MH432L00HC003", "MH432PA07C001", "MH432PA07C003", "MH432PA0ZC001", "MH432PA0ZC003", "MH6310028C560", "MH6310038C560", "MH6310068C560", "MH6310091C560", "MH6311716C560", "MH6311718C560", "MH6313008C560", "MH6313029C560", "MH6313038C560", "MH631S1876C560", "MHN217BBDC003", "MHN217BBDC007", "MHN217BBDC039", "MHN217BBDAC003", "MHN217BBDAC007", "MHN217BBDAC039", "MHN217BBDBC003", "MHN217BBDBC007", "MHN217BBDBC039", "MHN217BBDDC003", "MHN217BBDDC007", "MHN217BBDDC039", "MHN217BBDMC003", "MHN217BBDMC007", "MHN217BBDMC039", "MHN217BBDNC003", "MHN217BBDNC007", "MHN217BBDNC039", "MHN217BBDRC003", "MHN217BBDRC007", "MHN217BBDRC039", "MHN217BBDVC003", "MHN217BBDVC007", "MHN217BBDVC039", "MHN217BFDC003", "MHN217BFDC007", "MHN217BFDC039", "MHN217BFDAC003", "MHN217BFDAC007", "MHN217BFDAC039", "MHN217BFDBC003", "MHN217BFDBC007", "MHN217BFDBC039", "MHN217BFDDC003", "MHN217BFDDC007", "MHN217BFDDC039", "MHN217BFDMC003", "MHN217BFDMC007", "MHN217BFDMC039", "MHN217BFDNC003", "MHN217BFDNC007", "MHN217BFDNC039", "MHN217BFDRC003", "MHN217BFDRC007", "MHN217BFDRC039", "MHN217BFDVC003", "MHN217BFDVC007", "MHN217BFDVC039", "MHN217BNDC003", "MHN217BNDC007", "MHN217BNDC039", "MHN217BNDAC003", "MHN217BNDAC007", "MHN217BNDAC039", "MHN217BNDBC003", "MHN217BNDBC007", "MHN217BNDBC039", "MHN217BNDDC003", "MHN217BNDDC007", "MHN217BNDDC039", "MHN217BNDMC003", "MHN217BNDMC007", "MHN217BNDMC039", "MHN217BNDNC003", "MHN217BNDNC007", "MHN217BNDNC039", "MHN217BNDRC003", "MHN217BNDRC007", "MHN217BNDRC039", "MHN217BNDVC003", "MHN217BNDVC007", "MHN217BNDVC039", "MHN217BPDC003", "MHN217BPDC007", "MHN217BPDC039", "MHN217BPDAC003", "MHN217BPDAC007", "MHN217BPDAC039", "MHN217BPDBC003", "MHN217BPDBC007", "MHN217BPDBC039", "MHN217BPDDC003", "MHN217BPDDC007", "MHN217BPDDC039", "MHN217BPDMC003", "MHN217BPDMC007", "MHN217BPDMC039", "MHN217BPDNC003", "MHN217BPDNC007", "MHN217BPDNC039", "MHN217BPDRC003", "MHN217BPDRC007", "MHN217BPDRC039", "MHN217BPDVC003", "MHN217BPDVC007", "MHN217BPDVC039", "MHN217BT7C003", "MHN217BT7C007", "MHN217BT7C039", "MHN217BT7C064", "MHN217BT7AC003", "MHN217BT7AC007", "MHN217BT7AC039", "MHN217BT7AC064", "MHN217BT7UC003", "MHN217BT7UC007", "MHN217BT7UC039", "MHN217BTCC003", "MHN217BTCC007", "MHN217BTCC039", "MHN217BTCAC003", "MHN217BTCAC007", "MHN217BTCAC039", "MHN217BTDC007", "MHN217BTDC039", "MHN217BTDC064", "MHN217BTDAC003", "MHN217BTDAC007", "MHN217BTDAC039", "MHN217BTDBC003", "MHN217BTDBC007", "MHN217BTDBC039", "MHN217BTDDC003", "MHN217BTDDC007", "MHN217BTDDC039", "MHN217BTDMC003", "MHN217BTDMC007", "MHN217BTDMC039", "MHN217BTDNC003", "MHN217BTDNC007", "MHN217BTDNC039", "MHN217BTDRC003", "MHN217BTDRC007", "MHN217BTDRC039", "MHN217BTDVC003", "MHN217BTDVC007", "MHN217BTDVC039", "MHN217BTDYC039", "MHN217BTDYC064", "MHN217BTZC003", "MHN217BTZC007", "MHN217BTZC039", "MHN217BTZAC003", "MHN217BTZAC007", "MHN217BTZAC039", "MHN217BWDC003", "MHN217BWDC007", "MHN217BWDC039", "MHN217BWDC064", "MHN217BWDAC003", "MHN217BWDAC007", "MHN217BWDAC039", "MHN217BWDBC003", "MHN217BWDBC007", "MHN217BWDBC039", "MHN217BWDDC003", "MHN217BWDDC007", "MHN217BWDDC039", "MHN217BWDMC003", "MHN217BWDMC007", "MHN217BWDMC039", "MHN217BWDNC003", "MHN217BWDNC007", "MHN217BWDNC039", "MHN217BWDRC003", "MHN217BWDRC007", "MHN217BWDRC039", "MHN217BWDVC003", "MHN217BWDVC007", "MHN217BWDVC039", "MHN217GDDC003", "MHN217GDDC007", "MHN217GDDC039", "MHN217GDDAC003", "MHN217GDDAC007", "MHN217GDDAC039", "MHN217GDDBC003", "MHN217GDDBC007", "MHN217GDDBC039", "MHN217GDDDC003", "MHN217GDDDC007", "MHN217GDDDC039", "MHN217GDDMC003", "MHN217GDDMC007", "MHN217GDDMC039", "MHN217GDDNC003", "MHN217GDDNC007", "MHN217GDDNC039", "MHN217GDDRC003", "MHN217GDDRC007", "MHN217GDDRC039", "MHN217GDDVC003", "MHN217GDDVC007", "MHN217GDDVC039", "MHN217LTDYC039", "MHN217LTDYC064", "MHN21L00HC003", "MHN21L00HC007", "MHN21L00HC039", "MHN21LDBHC003", "MHN21LDBHC007", "MHN21LDBHC039", "MHN21LDBHAC003", "MHN21LDBHAC007", "MHN21LDBHAC039", "MHN21LDWHC003", "MHN21LDWHC007", "MHN21LDWHC039", "MHN21LDWHC064", "MHN21LDWHAC003", "MHN21LDWHAC007", "MHN21LDWHAC039", "MHN21LDWHAC064", "MHN21PA07C003", "MHN21PA07C007", "MHN21PA07C039", "MHN21PA07C064", "MHN21PA07UC003", "MHN21PA0ZC003", "MHN21PA0ZC039", "ML4387BBDC002", "ML4387BBDC014", "ML4387BBDC033", "ML4387BBDC107", "ML4387BBDAC002", "ML4387BBDAC014", "ML4387BBDAC033", "ML4387BBDAC107", "ML4387BNDC002", "ML4387BNDC014", "ML4387BNDC033", "ML4387BNDC107", "ML4387BNDAC002", "ML4387BNDAC014", "ML4387BNDAC033", "ML4387BNDAC107", "ML4387BT7C002", "ML4387BT7C014", "ML4387BT7C033", "ML4387BT7C107", "ML4387BT7AC002", "ML4387BT7AC014", "ML4387BT7AC033", "ML4387BT7AC107", "ML4387BTCC002", "ML4387BTCC014", "ML4387BTCC033", "ML4387BTCC107", "ML4387BTCAC002", "ML4387BTCAC014", "ML4387BTCAC033", "ML4387BTCAC107", "ML4387BTZC002", "ML4387BTZC014", "ML4387BTZC033", "ML4387BTZC107", "ML4387BTZAC002", "ML4387BTZAC014", "ML4387BTZAC033", "ML4387BTZAC107", "ML4387BWDC002", "ML4387BWDC014", "ML4387BWDC033", "ML4387BWDC107", "ML4387BWDAC002", "ML4387BWDAC014", "ML4387BWDAC033", "ML4387BWDAC107", "ML438L00HC002", "ML438L00HC014", "ML438L00HC033", "ML438L00HC107", "ML438PA07C002", "ML438PA07C014", "ML438PA07C033", "ML438PA07C107", "ML438PA0ZC002", "ML438PA0ZC014", "ML438PA0ZC033", "ML438PA0ZC107", "ML4916197C2713", "ML4916197C4505", "ML4916197C4506", "ML4916280C2713", "ML4916280C4505", "ML4916280C4506", "ML4916281C2713", "ML4916281C4505", "ML4916281C4506", "ML4916283C2713", "ML4916283C4506", "ML6304008CH235", "ML6304008CW363", "ML6304078CH235", "ML6304078CW363", "ML6930028C4003", "ML6930038C4003", "ML6930068C4003", "ML6931706C4008", "ML6931716C4003", "ML6931718C4003", "ML6931718C4008", "ML6933008C4003", "ML6933008C4006", "ML6933029C4003", "ML6940028C003", "ML6940028C008", "ML6940038C003", "ML6940068C008", "ML6940068YC008", "ML6941716C003", "ML6941716C008", "ML6941718C003", "ML6941718YC003", "ML6943008C003", "ML6943008C008", "ML6943029C003", "ML6943029C008", "MLCDRU409C001", "MM4006400CM772", "MM4006417CD115", "MM4006417CN918", "MM45A7322GCB241", "MM45A7322GCV001", "MN4467BBDC001", "MN4467BBDAC001", "MN4467BNDC001", "MN4467BNDAC001", "MN4467BT7C001", "MN4467BT7AC001", "MN4467BTCC001", "MN4467BTCAC001", "MN4467BTZC001", "MN4467BTZAC001", "MN4467BWDC001", "MN4467BWDAC001", "MN446L00HC001", "MN446PA07C001", "MN446PA0ZC001", "MN4477BBDC001", "MN4477BBDAC001", "MN4477BNDC001", "MN4477BNDAC001", "MN4477BT7C001", "MN4477BT7AC001", "MN4477BTCC001", "MN4477BTCAC001", "MN4477BTZC001", "MN4477BTZAC001", "MN4477BWDC001", "MN4477BWDAC001", "MN447L00HC001", "MN447PA07C001", "MN447PA0ZC001", "MN4487BBDC001", "MN4487BBDC002", "MN4487BBDAC001", "MN4487BBDAC002", "MN4487BNDC001", "MN4487BNDC002", "MN4487BNDAC001", "MN4487BNDAC002", "MN4487BT7C001", "MN4487BT7C002", "MN4487BT7AC001", "MN4487BT7AC002", "MN4487BTCC001", "MN4487BTCC002", "MN4487BTCAC001", "MN4487BTCAC002", "MN4487BTZC001", "MN4487BTZC002", "MN4487BTZAC001", "MN4487BTZAC002", "MN4487BWDC001", "MN4487BWDC002", "MN4487BWDAC001", "MN4487BWDAC002", "MN448L00HC001", "MN448L00HC002", "MN448PA07C001", "MN448PA07C002", "MN448PA0ZC001", "MN448PA0ZC002", "MN4719920C001", "MN4719920C201", "MN4719949CX950", "MN4747BBDC001", "MN4747BBDC003", "MN4747BBDAC001", "MN4747BBDAC003", "MN4747BNDC001", "MN4747BNDC003", "MN4747BNDAC001", "MN4747BNDAC003", "MN4747BT7C001", "MN4747BT7C003", "MN4747BT7AC001", "MN4747BT7AC003", "MN4747BTCC001", "MN4747BTCC003", "MN4747BTCAC001", "MN4747BTCAC003", "MN4747BTZC001", "MN4747BTZC003", "MN4747BTZAC001", "MN4747BTZAC003", "MN4747BWDC001", "MN4747BWDC003", "MN4747BWDAC001", "MN4747BWDAC003", "MN474L00HC001", "MN474L00HC003", "MN474PA07C001", "MN474PA07C003", "MN474PA0ZC001", "MN474PA0ZC003", "MN4757BBDC001", "MN4757BBDC002", "MN4757BBDAC001", "MN4757BBDAC002", "MN4757BNDC001", "MN4757BNDC002", "MN4757BNDAC001", "MN4757BNDAC002", "MN4757BT7C001", "MN4757BT7C002", "MN4757BT7AC001", "MN4757BT7AC002", "MN4757BTCC001", "MN4757BTCC002", "MN4757BTCAC001", "MN4757BTCAC002", "MN4757BTZC001", "MN4757BTZC002", "MN4757BTZAC001", "MN4757BTZAC002", "MN4757BWDC001", "MN4757BWDC002", "MN4757BWDAC001", "MN4757BWDAC002", "MN475L00HC001", "MN475L00HC002", "MN475PA07C001", "MN475PA07C002", "MN475PA0ZC001", "MN475PA0ZC002", "MN4767BBDC001", "MN4767BBDC002", "MN4767BBDAC001", "MN4767BBDAC002", "MN4767BNDC001", "MN4767BNDC002", "MN4767BNDAC001", "MN4767BNDAC002", "MN4767BT7C001", "MN4767BT7C002", "MN4767BT7AC001", "MN4767BT7AC002", "MN4767BTCC001", "MN4767BTCC002", "MN4767BTCAC001", "MN4767BTCAC002", "MN4767BTZC001", "MN4767BTZC002", "MN4767BTZAC001", "MN4767BTZAC002", "MN4767BWDC001", "MN4767BWDC002", "MN4767BWDAC001", "MN4767BWDAC002", "MN476L00HC001", "MN476L00HC002", "MN476PA07C001", "MN476PA07C002", "MN476PA0ZC001", "MN476PA0ZC002", "MN4777BBDC001", "MN4777BBDAC001", "MN4777BNDC001", "MN4777BNDAC001", "MN4777BT7C001", "MN4777BT7AC001", "MN4777BTCC001", "MN4777BTCAC001", "MN4777BTZC001", "MN4777BTZAC001", "MN4777BWDC001", "MN4777BWDAC001", "MN477L00HC001", "MN477PA07C001", "MN477PA0ZC001", "MN6301718C013", "MN6311716C017", "MN6390028C013", "MN6390028C015", "MN6390038C013", "MN6390038C015", "MN6390068C013", "MN6390068C015", "MN6391706C013", "MN6391706C015", "MN6391716C013", "MN6391716C015", "MN6391718C013", "MN6391718C015", "MN6393008C013", "MN6393008C015", "MN6411706C015", "MN6510038C005", "MN6511716C030", "MN6511718C005", "MN6540028C001", "MN6540028C005", "MN6540028C030", "MN6540038C001", "MN6540068C001", "MN6540068C005", "MN6540068C030", "MN6541706C001", "MN6541706C005", "MN6541706C030", "MN6541716C001", "MN6541716C005", "MN6541716C030", "MN6541718C001", "MN6541718C005", "MN6541718C030", "MN6543008C001", "MN6543008C005", "MN6543008C030", "MN6550028C002", "MN6550028C035", "MN6550028C131", "MN6550028C461", "MN6550028C928", "MN6550038C035", "MN6550038C131", "MN6550038C461", "MN6550038C928", "MN6550068C035", "MN6550068C131", "MN6550068C461", "MN6550068C928", "MN6551716C035", "MN6551716C131", "MN6551716C404", "MN6551716C461", "MN6551716C928", "MN6551718C035", "MN6551718C131", "MN6551718C461", "MN6551718C928", "MN6553008C035", "MN6553008C131", "MN6553008C461", "MN6553008C928", "MN6553029C035", "MN6553029C131", "MN6553029C461", "MN6553029C928", "MN6561716C093", "MN6700028C001", "MN6700028C007", "MN6700038C001", "MN6700038C007", "MN6700068C001", "MN6700068C007", "MN6701716C001", "MN6701716C007", "MN6701718C001", "MN6701718C007", "MN6703008C001", "MN6703008C007", "MN6703029C001", "MN6703029C007", "MQ4177BBDC043", "MQ4177BBDC044", "MQ4177BBDAC043", "MQ4177BBDAC044", "MQ4177BNDC043", "MQ4177BNDC044", "MQ4177BNDAC043", "MQ4177BNDAC044", "MQ4177BT7C043", "MQ4177BT7C044", "MQ4177BT7AC043", "MQ4177BT7AC044", "MQ4177BTCC043", "MQ4177BTCC044", "MQ4177BTCAC043", "MQ4177BTCAC044", "MQ4177BTZC043", "MQ4177BTZC044", "MQ4177BTZAC043", "MQ4177BTZAC044", "MQ4177BWDC043", "MQ4177BWDC044", "MQ4177BWDAC043", "MQ4177BWDAC044", "MQ417L00HC043", "MQ417L00HC044", "MQ417PA07C043", "MQ417PA07C044", "MQ417PA0ZC043", "MQ417PA0ZC044", "MQ8130018CU381", "MQ8588J01C685", "MQ8588J01C687", "MQ8588J01C906", "MQ8588J01LC687", "MR4407BTDC003", "MR4407BTDC014", "MR7160028C010", "MR7160028C014", "MR7160028C017", "MR7160028C043", "MR7160038C010", "MR7160038C014", "MR7160038C017", "MR7160038C043", "MR7160068C010", "MR7160068C017", "MR7160068C043", "MR7161716C010", "MR7161716C017", "MR7161716C043", "MR7161718C010", "MR7161718C017", "MR7161718C043", "MR7163008C010", "MR7163008C017", "MR7163008C043", "MR7163029C010", "MR7163029C017", "MR7163029C043", "MR7163038C010", "MR7163038C017", "MR7163038C043", "MR7163058C010", "MR7163058C017", "MR7163058C043", "MR716S1886C047", "MR8130003C004", "MR8130003C007", "MR8130003C101", "MR8130003C108", "MR8130003CD781", "MR8130003CE498", "MR8130003CG689", "MR8130003CG936", "MR8130003CN024", "MR8130003YC007", "MR8130003YC101", "MR8130003YC108", "MR8130003YCD781", "MR8130003YCE498", "MR8130003YCG689", "MR8130003YCG936", "MR8130003YCN024", "MR813S005C004", "MR813S005C007", "MR813S005C101", "MR813S005CD781", "MR813S005CE498", "MR813S005CG689", "MR813S005CG936", "MR813S005CN024", "MR813S005YC004", "MR813S005YC007", "MR813S005YC101", "MR813S005YCD781", "MR813S005YCE498", "MR813S005YCG689", "MR813S005YCG936", "MR813S005YCN024", "MS4287BBDC001", "MS4287BBDC002", "MS4287BBDC003", "MS4287BBDC004", "MS4287BBDAC001", "MS4287BBDAC002", "MS4287BBDAC003", "MS4287BBDAC004", "MS4287BNDC001", "MS4287BNDC002", "MS4287BNDC003", "MS4287BNDC004", "MS4287BNDAC001", "MS4287BNDAC002", "MS4287BNDAC003", "MS4287BNDAC004", "MS4287BT7C001", "MS4287BT7C002", "MS4287BT7C003", "MS4287BT7C004", "MS4287BT7AC001", "MS4287BT7AC002", "MS4287BT7AC003", "MS4287BT7AC004", "MS4287BTCC001", "MS4287BTCC002", "MS4287BTCC003", "MS4287BTCC004", "MS4287BTCAC001", "MS4287BTCAC002", "MS4287BTCAC003", "MS4287BTCAC004", "MS4287BTZC001", "MS4287BTZC002", "MS4287BTZC003", "MS4287BTZC004", "MS4287BTZAC001", "MS4287BTZAC002", "MS4287BTZAC003", "MS4287BTZAC004", "MS4287BWDC001", "MS4287BWDC002", "MS4287BWDC003", "MS4287BWDC004", "MS4287BWDAC001", "MS4287BWDAC002", "MS4287BWDAC003", "MS4287BWDAC004", "MS428L00HC001", "MS428L00HC002", "MS428L00HC003", "MS428L00HC004", "MS428PA07C001", "MS428PA07C002", "MS428PA07C003", "MS428PA07C004", "MS428PA0ZC001", "MS428PA0ZC002", "MS428PA0ZC003", "MS428PA0ZC004", "MS4297BBDC001", "MS4297BBDC002", "MS4297BBDAC001", "MS4297BBDAC002", "MS4297BNDC001", "MS4297BNDC002", "MS4297BNDAC001", "MS4297BNDAC002", "MS4297BT7C001", "MS4297BT7C002", "MS4297BT7AC001", "MS4297BT7AC002", "MS4297BTCC001", "MS4297BTCC002", "MS4297BTCAC001", "MS4297BTCAC002", "MS4297BTZC001", "MS4297BTZC002", "MS4297BTZAC001", "MS4297BTZAC002", "MS4297BWDC001", "MS4297BWDC002", "MS4297BWDAC001", "MS4297BWDAC002", "MS429L00HC001", "MS429L00HC002", "MS429PA07C001", "MS429PA07C002", "MS429PA0ZC001", "MS429PA0ZC002", "MS4307BBDC001", "MS4307BBDC003", "MS4307BBDC004", "MS4307BBDAC001", "MS4307BBDAC003", "MS4307BBDAC004", "MS4307BNDC001", "MS4307BNDC003", "MS4307BNDC004", "MS4307BNDAC001", "MS4307BNDAC003", "MS4307BNDAC004", "MS4307BT7C001", "MS4307BT7C003", "MS4307BT7C004", "MS4307BT7AC001", "MS4307BT7AC003", "MS4307BT7AC004", "MS4307BTCC001", "MS4307BTCC003", "MS4307BTCC004", "MS4307BTCAC001", "MS4307BTCAC003", "MS4307BTCAC004", "MS4307BTZC001", "MS4307BTZC003", "MS4307BTZC004", "MS4307BTZAC001", "MS4307BTZAC003", "MS4307BTZAC004", "MS4307BWDC001", "MS4307BWDC003", "MS4307BWDC004", "MS4307BWDAC001", "MS4307BWDAC003", "MS4307BWDAC004", "MS430L00HC001", "MS430L00HC003", "MS430L00HC004", "MS430PA07C001", "MS430PA07C003", "MS430PA07C004", "MS430PA0ZC001", "MS430PA0ZC003", "MS430PA0ZC004", "MS4317BBDC004", "MS4317BBDC006", "MS4317BBDC013", "MS4317BBDC017", "MS4317BBDC029", "MS4317BBDAC004", "MS4317BBDAC006", "MS4317BBDAC013", "MS4317BBDAC017", "MS4317BBDAC029", "MS4317BNDC004", "MS4317BNDC006", "MS4317BNDC013", "MS4317BNDC017", "MS4317BNDC029", "MS4317BNDAC004", "MS4317BNDAC006", "MS4317BNDAC013", "MS4317BNDAC017", "MS4317BNDAC029", "MS4317BT7C004", "MS4317BT7C006", "MS4317BT7C013", "MS4317BT7C017", "MS4317BT7C029", "MS4317BT7AC004", "MS4317BT7AC006", "MS4317BT7AC013", "MS4317BT7AC017", "MS4317BT7AC029", "MS4317BTCC004", "MS4317BTCC006", "MS4317BTCC013", "MS4317BTCC017", "MS4317BTCC029", "MS4317BTCAC004", "MS4317BTCAC006", "MS4317BTCAC013", "MS4317BTCAC017", "MS4317BTCAC029", "MS4317BTZC004", "MS4317BTZC006", "MS4317BTZC013", "MS4317BTZC017", "MS4317BTZC029", "MS4317BTZAC004", "MS4317BTZAC006", "MS4317BTZAC013", "MS4317BTZAC017", "MS4317BTZAC029", "MS4317BWDC004", "MS4317BWDC006", "MS4317BWDC013", "MS4317BWDC017", "MS4317BWDC029", "MS4317BWDAC004", "MS4317BWDAC006", "MS4317BWDAC013", "MS4317BWDAC017", "MS4317BWDAC029", "MS431L00HC004", "MS431L00HC006", "MS431L00HC013", "MS431L00HC017", "MS431L00HC029", "MS431PA07C004", "MS431PA07C006", "MS431PA07C013", "MS431PA07C017", "MS431PA07C029", "MS431PA0ZC004", "MS431PA0ZC006", "MS431PA0ZC013", "MS431PA0ZC017", "MS431PA0ZC029", "MS4327BBDC003", "MS4327BBDC004", "MS4327BBDC005", "MS4327BBDC006", "MS4327BBDC007", "MS4327BBDAC003", "MS4327BBDAC004", "MS4327BBDAC005", "MS4327BBDAC006", "MS4327BBDAC007", "MS4327BNDC003", "MS4327BNDC004", "MS4327BNDC005", "MS4327BNDC006", "MS4327BNDC007", "MS4327BNDAC003", "MS4327BNDAC004", "MS4327BNDAC005", "MS4327BNDAC006", "MS4327BNDAC007", "MS4327BT7C003", "MS4327BT7C004", "MS4327BT7C005", "MS4327BT7C006", "MS4327BT7C007", "MS4327BT7AC003", "MS4327BT7AC004", "MS4327BT7AC005", "MS4327BT7AC006", "MS4327BT7AC007", "MS4327BTCC003", "MS4327BTCC004", "MS4327BTCC005", "MS4327BTCC006", "MS4327BTCC007", "MS4327BTCAC003", "MS4327BTCAC004", "MS4327BTCAC005", "MS4327BTCAC006", "MS4327BTCAC007", "MS4327BTZC003", "MS4327BTZC004", "MS4327BTZC005", "MS4327BTZC006", "MS4327BTZC007", "MS4327BTZAC003", "MS4327BTZAC004", "MS4327BTZAC005", "MS4327BTZAC006", "MS4327BTZAC007", "MS4327BWDC003", "MS4327BWDC004", "MS4327BWDC005", "MS4327BWDC006", "MS4327BWDC007", "MS4327BWDAC003", "MS4327BWDAC004", "MS4327BWDAC005", "MS4327BWDAC006", "MS4327BWDAC007", "MS432L00HC003", "MS432L00HC004", "MS432L00HC005", "MS432L00HC006", "MS432L00HC007", "MS432PA07C003", "MS432PA07C004", "MS432PA07C005", "MS432PA07C006", "MS432PA07C007", "MS432PA0ZC003", "MS432PA0ZC004", "MS432PA0ZC005", "MS432PA0ZC006", "MS432PA0ZC007", "MS4337BBDC002", "MS4337BBDC004", "MS4337BBDC005", "MS4337BBDAC002", "MS4337BBDAC004", "MS4337BBDAC005", "MS4337BNDC002", "MS4337BNDC004", "MS4337BNDC005", "MS4337BNDAC002", "MS4337BNDAC004", "MS4337BNDAC005", "MS4337BT7C002", "MS4337BT7C004", "MS4337BT7C005", "MS4337BT7AC002", "MS4337BT7AC004", "MS4337BT7AC005", "MS4337BTCC002", "MS4337BTCC004", "MS4337BTCC005", "MS4337BTCAC002", "MS4337BTCAC004", "MS4337BTCAC005", "MS4337BTZC002", "MS4337BTZC004", "MS4337BTZC005", "MS4337BTZAC002", "MS4337BTZAC004", "MS4337BTZAC005", "MS4337BWDC002", "MS4337BWDC004", "MS4337BWDC005", "MS4337BWDAC002", "MS4337BWDAC004", "MS4337BWDAC005", "MS433L00HC002", "MS433L00HC004", "MS433L00HC005", "MS433PA07C002", "MS433PA07C004", "MS433PA07C005", "MS433PA0ZC002", "MS433PA0ZC004", "MS433PA0ZC005", "MS6660028C001", "MS6660028C012", "MS6660028C013", "MS6660038C001", "MS6660038C013", "MS6660068C001", "MS6660068C012", "MS6660068C013", "MS6661706C013", "MS6661716C001", "MS6661716C012", "MS6661716C013", "MS6661718C001", "MS6661718C013", "MS6663008C001", "MS6663008C012", "MS6663008C013", "MS6663029C001", "MS6663029C012", "MS6663029C013", "MS6663038C001", "MS6663038C012", "MS6663038C013", "MSC598VSC074G", "MSC598VSCW411", "MSC598VSCW611", "MSC606AVCU929", "MTB531308C159", "MTB531308C4425", "MTB531344C159", "MTB531344C4425", "MTB537407C159", "MTB537407C4425", "MTL538200C008", "MTL538200C159", "MTS531308C159", "MTS531308C4425", "MTS531344C159", "MTS531344C4425", "MTS537407C159", "MTS537407C4425", "MTU013202GC5774", "MTU013202GC5777", "MTU013202GC5794", "MTU013202GC9248", "MTU013212GC5774", "MTU013212GC5777", "MTU013212GC5794", "MTU013212GC9248", "MTU013233GC5774", "MTU013233GC5777", "MTU013233GC5794", "MTU013233GC9248", "MTU013243GC5774", "MTU013243GC5777", "MTU013243GC5794", "MTU013243GC9248", "MTU013263GC5774", "MTU013263GC5777", "MTU013263GC5794", "MTU013263GC9248", "MTU013265GCZ065", "MTU019059GCZ065", "MTU019060GC5774", "MTU019069GC5774", "MTU019069GC5777", "MTU019069GC5794", "MTU019069GC9248", "MTU019072GC5774", "MTU019072GC5777", "MTU019072GC5794", "MTU019072GC9248", "MTU019079GC5774", "MTU019079GC5777", "MTU019079GC5794", "MTU019079GC9248", "MTU019080GC5774", "MW4187BTCC008", "MW6350028C002", "MW6350028C004", "MW6350028C006", "MW6350028C008", "MW6350038C002", "MW6350038C004", "MW6350038C006", "MW6350038C008", "MW6350068C002", "MW6350068C004", "MW6350068C006", "MW6350068C008", "MW6351716C002", "MW6351716C004", "MW6351716C006", "MW6351716C008", "MW6351718C002", "MW6351718C004", "MW6351718C006", "MW6351718C008", "MW6353008C002", "MW6353008C004", "MW6353008C006", "MW6353008C008", "MW6353029C002", "MW6353029C004", "MW6353029C006", "MW6353029C008", "MWSEU006C7644", "MWSEU163C7644", "MWSEU320C7644", "MWSEU335C2607", "MWSEU359C7644", "MWSTU156C6610", "MWSTU160C6610", "MWSTU335C6610", "MWZIU006C6608", "MWZIU156C6608", "MWZIU160C6608", "MWZIU161C6608", "MWZIU163C6608", "MWZIU180C6608", "MWZIU187C6608", "MWZIU320C6608", "MWZIU334C6608", "MWZIU335C6608", "MWZIU336C6608", "MWZIU349C6608", "MWZIU360C6608", "MWZIU371C6608", "MZUCHOE971C6491", "MZUCHOK877C6100", "MZUCMGK861C6271", "MZUCOBB943C6761", "MZUCOBB943C7654", "MZUCOBB946C7656", "MZUPMBO252CB308", "MZUSHAK937C101", "MZUSIBJ233CO795", "MZUSUMK937C101", "MZUTBHO255CU090", "MZUTBHO255CY742", "MZUVRNU891C8033", "MZUVRNU892C8033", "M277PD221NC6009", "M277PD221NC7210", "M277PD221NC7300", "M22501306CC248", "M22501306CQ435", "M22501306CQ636", "M22501306CR119", "M22501306CV260", "M22501306CZ157", "M22501309CC248", "M22501309CQ435", "M22501309CQ636", "M22501309CR119", "M22501309CV260", "M22501309CZ157", "M22501319CC248", "M22501319CQ435", "M22501319CQ636", "M22501319CR119", "M22501319CV260", "M22501319CZ157", "M225P116CC248", "M225P116CI839", "M225P116CQ435", "M225P116CQ636", "M225P116CR119", "M225P116CV260", "M225P116CZ157", "M225P139CC248", "M225P139CQ435", "M225P139CQ636", "M225P139CR119", "M225P139CV260", "M225P139CZ157", "M225P409CC248", "M225P409CQ435", "M225P409CQ636", "M225P409CR119", "M225P409CV260", "M225P409CZ157", "M225P419CC248", "M225P419CQ435", "M225P419CQ636", "M225P419CR119", "M225P419CV260", "M225P419CZ157", "M227P149CL273", "M227P149CL293", "M7M3P636C3708", "M7M3P636CJ966", "MAUAL251C6719", "MAUAL253C6719", "ML4659909C001", "ML4659923C001", "ML4659928C001", "ML4659929C001", "MLGEU381CJ029", "MLSEU364C7644", "MM4006400CA527", "MM4006400CC179", "MM4006400CH796", "MM4006400CI623", "MM4006400CN918", "MM4006402CA527", "MM4006402CC179", "MM4006402CD115", "MM4006402CI623", "MM4006402CM772", "MM4006417CA527", "MM4006417CC179", "MM4006417CI623", "MM4596401CC494", "MM4596401CJ357", "MM4596401CS448", "MM4596401CU507", "MM4596403CJ357", "MM4596403CS448", "MM4596403CU507", "MQ4116403CC289", "MQ4116419C012", "MQ4116435CG449", "MQ4116436CC753", "MQ4116436CT480", "MQ4117003C001", "MQ4117003C012", "MQ4117008C001", "MQ4117008C012", "MQ4117008BC001", "MQ4117008BC012", "MQ4117008DC001", "MQ4117008DC012", "MQ4117008MC001", "MQ4117008MC012", "MQ4117022C001", "MQ4117022C012", "MQ4117022BC001", "MQ4117022BC012", "MQ4117022DC001", "MQ4117022DC012", "MQ4117022MC001", "MQ4117022MC012", "MQ4119003C001", "MQ4119003C012", "MQ4119003BC001", "MQ4119003BC012", "MQ4119003DC001", "MQ4119003DC012", "MQ4119003MC001", "MQ4119003MC012", "MQ4119030C001", "MQ4119030C012", "MQ4119039C001", "MQ4119039C012", "MQ4119040C001", "MQ4119040C012", "MQ4119118C001", "MQ4119118C012", "MQ4119119C001", "MQ4119119C012", "MT4976401CJ748", "MT4976401CM151", "MT4976401CW448", "MT4976403CJ748", "MT4976403CM151", "MT4976403CW448", "MT4976416CC976", "MT4976416CN030", "MT4976416CO780", "MT4976416CS618", "MT4976416CU842", "MT4976416CV336", "MT4976416CW922", "MT4976416CY940", "MWARG209CG303", "MWARG210CG303", "MWSEU006C2607", "MWSEU006C7651", "MWSEU156C2607", "MWSEU156C7651", "MWSEU160C7651", "MWSEU335C7644", "MWSEU335C7651", "MWSEU336C2607", "MWSEU359C2607", "MWSEU371C7644", "MWSTU006C6610", "MWSTU161C6610", "MWSTU163C6610", "MWSTU180C6610", "MWSTU320C6610", "MWSTU336C6610", "MZUCHOK971C6100", "EZUBLBT257CS022", "EZUBTSJ233CV291", "EZUBTST257C6751", "EZUILST257CS684", "EZUPMBO252CB308", "EZUPMBO252CJ987", "EZUSIBJ233CH086", "EZUSIBJ233CI067", "MZUBLBT257CS022", "MZUBTSJ233CV291", "MZUBTST257C6751", "MZUCCLQ879C8041", "MZUCCLQ879C8044", "MZUCCLQ880C8041", "MZUCCLQ880C8044", "MZUCEMQ879C8041", "MZUCEMQ879C8044", "MZUCEMQ880C8041", "MZUCEMQ880C8044", "MZUCMAK909C8029", "MZUCMAK909C8030", "MZUCMAK909C8031", "MZUCMAK910C8029", "MZUCMAK910C8030", "MZUCMAK910C8031", "MZUCPAM957C6554", "MZUCPAM957C6582", "MZUCPAM957C6699", "MZUCPAQ879C6554", "MZUCPAQ879C6582", "MZUCPAQ879C6699", "MZUCPAQ880C6554", "MZUCPAQ880C6582", "MZUCPAQ880C6699", "MZUCSMM893C6554", "MZUCSMM893C6582", "MZUCSMM893C6699", "MZUERFS890CX496", "MZUILST257CS684", "MZUNETK183C6391", "MZUNETK183C6559", "MZUNETK183C6566", "MZUNETK183C7623", "MZUNETK183C7625", "MZUPMBO252CJ987", "MZUSBBA258CM106", "MZUSBBA258CW785", "MZUSBBA258CZ014", "MZUSIBJ233CH086", "MZUSIBJ233CI067", "MZUSMFS890CI421", "MZUWLBO253CA358", "MZUWLBO253CJ544", "MZUWLBO253CO287", "MD4107BP7C002", "MD4107BP7C006", "MD4107BP7C087", "MD4107BP7AC002", "MD4107BP7AC006", "MD4107BP7AC087", "MD4107BPZC002", "MD4107BPZC006", "MD4107BPZC087", "MD4107BPZAC002", "MD4107BPZAC006", "MD4107BPZAC087", "MD4557BP7C001", "MD4557BP7C007", "MD4557BP7AC001", "MD4557BP7AC007", "MD4557BPZC001", "MD4557BPZC007", "MD4557BPZAC001", "MD4557BPZAC007", "MD4677BP7C009", "MD4677BP7C011", "MD4677BP7AC009", "MD4677BP7AC011", "MD4677BPZC009", "MD4677BPZC011", "MD4677BPZAC009", "MD4677BPZAC011", "MF4507BP7C001", "MF4507BP7C074", "MF4507BP7C176", "MF4507BP7C233", "MF4507BP7C276", "MF4507BP7AC001", "MF4507BP7AC074", "MF4507BP7AC176", "MF4507BP7AC233", "MF4507BP7AC276", "MF4507BPZC001", "MF4507BPZC074", "MF4507BPZC176", "MF4507BPZC233", "MF4507BPZC276", "MF4507BPZAC001", "MF4507BPZAC074", "MF4507BPZAC176", "MF4507BPZAC233", "MF4507BPZAC276", "MF4597BP7C003", "MF4597BP7C005", "MF4597BP7C059", "MF4597BP7C079", "MF4597BP7C144", "MF4597BP7C240", "MF4597BP7AC003", "MF4597BP7AC005", "MF4597BP7AC059", "MF4597BP7AC079", "MF4597BP7AC144", "MF4597BP7AC240", "MF4597BPZC003", "MF4597BPZC005", "MF4597BPZC059", "MF4597BPZC079", "MF4597BPZC144", "MF4597BPZC240", "MF4597BPZAC003", "MF4597BPZAC005", "MF4597BPZAC059", "MF4597BPZAC079", "MF4597BPZAC144", "MF4597BPZAC240", "MG4647BP7C001", "MG4647BP7C002", "MG4647BP7AC001", "MG4647BP7AC002", "MG4647BPZC001", "MG4647BPZC002", "MG4647BPZAC001", "MG4647BPZAC002", "MG4657BP7C002", "MG4657BP7C003", "MG4657BP7AC002", "MG4657BP7AC003", "MG4657BPZC002", "MG4657BPZC003", "MG4657BPZAC002", "MG4657BPZAC003", "MG4827BP7C001", "MG4827BP7C002", "MG4827BP7C004", "MG4827BP7C248", "MG4827BP7C286", "MG4827BP7AC001", "MG4827BP7AC002", "MG4827BP7AC004", "MG4827BP7AC248", "MG4827BP7AC286", "MG4827BPZC001", "MG4827BPZC002", "MG4827BPZC004", "MG4827BPZC248", "MG4827BPZC286", "MG4827BPZAC001", "MG4827BPZAC002", "MG4827BPZAC004", "MG4827BPZAC248", "MG4827BPZAC286", "MH4327BP7C001", "MH4327BP7C003", "MH4327BP7AC001", "MH4327BP7AC003", "MH4327BPZC001", "MH4327BPZC003", "MH4327BPZAC001", "MH4327BPZAC003", "MHN217BP7C003", "MHN217BP7C007", "MHN217BP7C039", "MHN217BP7AC003", "MHN217BP7AC007", "MHN217BP7AC039", "MHN217BPZC003", "MHN217BPZC007", "MHN217BPZC039", "MHN217BPZAC003", "MHN217BPZAC007", "MHN217BPZAC039", "ML4387BP7C002", "ML4387BP7C014", "ML4387BP7C033", "ML4387BP7C107", "ML4387BP7AC002", "ML4387BP7AC014", "ML4387BP7AC033", "ML4387BP7AC107", "ML4387BPZC002", "ML4387BPZC014", "ML4387BPZC033", "ML4387BPZC107", "ML4387BPZAC002", "ML4387BPZAC014", "ML4387BPZAC033", "ML4387BPZAC107", "MN4467BP7C001", "MN4467BP7AC001", "MN4467BPZC001", "MN4467BPZAC001", "MN4477BP7C001", "MN4477BP7AC001", "MN4477BPZC001", "MN4477BPZAC001", "MN4487BP7C001", "MN4487BP7C002", "MN4487BP7AC001", "MN4487BP7AC002", "MN4487BPZC001", "MN4487BPZC002", "MN4487BPZAC001", "MN4487BPZAC002", "MN4747BP7C001", "MN4747BP7C003", "MN4747BP7AC001", "MN4747BP7AC003", "MN4747BPZC001", "MN4747BPZC003", "MN4747BPZAC001", "MN4747BPZAC003", "MN4757BP7C001", "MN4757BP7C002", "MN4757BP7AC001", "MN4757BP7AC002", "MN4757BPZC001", "MN4757BPZC002", "MN4757BPZAC001", "MN4757BPZAC002", "MN4767BP7C001", "MN4767BP7C002", "MN4767BP7AC001", "MN4767BP7AC002", "MN4767BPZC001", "MN4767BPZC002", "MN4767BPZAC001", "MN4767BPZAC002", "MN4777BP7C001", "MN4777BP7AC001", "MN4777BPZC001", "MN4777BPZAC001", "MQ4177BP7C043", "MQ4177BP7C044", "MQ4177BP7AC043", "MQ4177BP7AC044", "MQ4177BPZC043", "MQ4177BPZC044", "MQ4177BPZAC043", "MQ4177BPZAC044", "MS4287BP7C001", "MS4287BP7C002", "MS4287BP7C003", "MS4287BP7C004", "MS4287BP7AC001", "MS4287BP7AC002", "MS4287BP7AC003", "MS4287BP7AC004", "MS4287BPZC001", "MS4287BPZC002", "MS4287BPZC003", "MS4287BPZC004", "MS4287BPZAC001", "MS4287BPZAC002", "MS4287BPZAC003", "MS4287BPZAC004", "MS4297BP7C001", "MS4297BP7C002", "MS4297BP7AC001", "MS4297BP7AC002", "MS4297BPZC001", "MS4297BPZC002", "MS4297BPZAC001", "MS4297BPZAC002", "MS4307BP7C001", "MS4307BP7C003", "MS4307BP7C004", "MS4307BP7AC001", "MS4307BP7AC003", "MS4307BP7AC004", "MS4307BPZC001", "MS4307BPZC003", "MS4307BPZC004", "MS4307BPZAC001", "MS4307BPZAC003", "MS4307BPZAC004", "MS4317BP7C004", "MS4317BP7C006", "MS4317BP7C013", "MS4317BP7C017", "MS4317BP7C029", "MS4317BP7AC004", "MS4317BP7AC006", "MS4317BP7AC013", "MS4317BP7AC017", "MS4317BP7AC029", "MS4317BPZC004", "MS4317BPZC006", "MS4317BPZC013", "MS4317BPZC017", "MS4317BPZC029", "MS4317BPZAC004", "MS4317BPZAC006", "MS4317BPZAC013", "MS4317BPZAC017", "MS4317BPZAC029", "MS4327BP7C003", "MS4327BP7C004", "MS4327BP7C005", "MS4327BP7C006", "MS4327BP7C007", "MS4327BP7AC003", "MS4327BP7AC004", "MS4327BP7AC005", "MS4327BP7AC006", "MS4327BP7AC007", "MS4327BPZC003", "MS4327BPZC004", "MS4327BPZC005", "MS4327BPZC006", "MS4327BPZC007", "MS4327BPZAC003", "MS4327BPZAC004", "MS4327BPZAC005", "MS4327BPZAC006", "MS4327BPZAC007", "MS4337BP7C002", "MS4337BP7C004", "MS4337BP7C005", "MS4337BP7AC002", "MS4337BP7AC004", "MS4337BP7AC005", "MS4337BPZC002", "MS4337BPZC004", "MS4337BPZC005", "MS4337BPZAC002", "MS4337BPZAC004", "MS4337BPZAC005", "M032PLDN6C263", "MD410EDNEC002", "MD410EDNEC006", "MD410EDNEC087", "MD410EDNEAC002", "MD410EDNEAC006", "MD410EDNEAC087", "MD410LDFHC002", "MD410LDFHC006", "MD410LDFHC087", "MD410LDFHAC002", "MD410LDFHAC006", "MD410LDFHAC087", "MD410LDNHC002", "MD410LDNHC006", "MD410LDNHC087", "MD410LDNHAC002", "MD410LDNHAC006", "MD410LDNHAC087", "MD455LDBHC001", "MD455LDBHC007", "MD455LDBHAC001", "MD455LDBHAC007", "MD455LDFHC001", "MD455LDFHC007", "MD455LDFHAC001", "MD455LDFHAC007", "MD455LDNHC001", "MD455LDNHC007", "MD455LDNHAC001", "MD455LDNHAC007", "MD455LDWHC001", "MD455LDWHC007", "MD455LDWHAC001", "MD455LDWHAC007", "MD467LDBHC009", "MD467LDBHC011", "MD467LDBHAC009", "MD467LDBHAC011", "MD467LDFHC009", "MD467LDFHC011", "MD467LDFHAC009", "MD467LDFHAC011", "MD467LDNHC009", "MD467LDNHC011", "MD467LDNHAC009", "MD467LDNHAC011", "MD467LDWHC009", "MD467LDWHC011", "MD467LDWHAC009", "MD467LDWHAC011", "MF450LDBHC001", "MF450LDBHC074", "MF450LDBHC176", "MF450LDBHC233", "MF450LDBHC276", "MF450LDBHAC001", "MF450LDBHAC074", "MF450LDBHAC176", "MF450LDBHAC233", "MF450LDBHAC276", "MF450LDFHC001", "MF450LDFHC074", "MF450LDFHC176", "MF450LDFHC233", "MF450LDFHC276", "MF450LDFHAC001", "MF450LDFHAC074", "MF450LDFHAC176", "MF450LDFHAC233", "MF450LDFHAC276", "MF450LDNHC001", "MF450LDNHC074", "MF450LDNHC176", "MF450LDNHC233", "MF450LDNHC276", "MF450LDNHAC001", "MF450LDNHAC074", "MF450LDNHAC176", "MF450LDNHAC233", "MF450LDNHAC276", "MF450LDWHC001", "MF450LDWHC074", "MF450LDWHC176", "MF450LDWHC233", "MF450LDWHC276", "MF450LDWHAC001", "MF450LDWHAC074", "MF450LDWHAC176", "MF450LDWHAC233", "MF450LDWHAC276", "MF459LDBHC003", "MF459LDBHC005", "MF459LDBHC059", "MF459LDBHC079", "MF459LDBHC144", "MF459LDBHC240", "MF459LDBHAC003", "MF459LDBHAC005", "MF459LDBHAC059", "MF459LDBHAC079", "MF459LDBHAC144", "MF459LDBHAC240", "MF459LDFHC003", "MF459LDFHC005", "MF459LDFHC059", "MF459LDFHC079", "MF459LDFHC144", "MF459LDFHC240", "MF459LDFHAC003", "MF459LDFHAC005", "MF459LDFHAC059", "MF459LDFHAC079", "MF459LDFHAC144", "MF459LDFHAC240", "MF459LDNHC003", "MF459LDNHC005", "MF459LDNHC059", "MF459LDNHC079", "MF459LDNHC144", "MF459LDNHC240", "MF459LDNHAC003", "MF459LDNHAC005", "MF459LDNHAC059", "MF459LDNHAC079", "MF459LDNHAC144", "MF459LDNHAC240", "MF459LDWHC003", "MF459LDWHC005", "MF459LDWHC059", "MF459LDWHC079", "MF459LDWHC144", "MF459LDWHC240", "MF459LDWHAC003", "MF459LDWHAC005", "MF459LDWHAC059", "MF459LDWHAC079", "MF459LDWHAC144", "MF459LDWHAC240", "MG464LDBHC001", "MG464LDBHC002", "MG464LDBHAC001", "MG464LDBHAC002", "MG464LDFHC001", "MG464LDFHC002", "MG464LDFHAC001", "MG464LDFHAC002", "MG464LDNHC001", "MG464LDNHC002", "MG464LDNHAC001", "MG464LDNHAC002", "MG464LDWHC001", "MG464LDWHC002", "MG464LDWHAC001", "MG464LDWHAC002", "MG465HDF0C003", "MG465LDBHC002", "MG465LDBHC003", "MG465LDBHAC002", "MG465LDBHAC003", "MG465LDFHC002", "MG465LDFHC003", "MG465LDFHAC002", "MG465LDFHAC003", "MG465LDNHC002", "MG465LDNHC003", "MG465LDNHAC002", "MG465LDNHAC003", "MG465LDWHC002", "MG465LDWHC003", "MG465LDWHAC002", "MG465LDWHAC003", "MG482LDBHC001", "MG482LDBHC002", "MG482LDBHC004", "MG482LDBHC248", "MG482LDBHC286", "MG482LDBHAC001", "MG482LDBHAC002", "MG482LDBHAC004", "MG482LDBHAC248", "MG482LDBHAC286", "MG482LDFHC001", "MG482LDFHC002", "MG482LDFHC004", "MG482LDFHC248", "MG482LDFHC286", "MG482LDFHAC001", "MG482LDFHAC002", "MG482LDFHAC004", "MG482LDFHAC248", "MG482LDFHAC286", "MG482LDNHC001", "MG482LDNHC002", "MG482LDNHC004", "MG482LDNHC248", "MG482LDNHC286", "MG482LDNHAC001", "MG482LDNHAC002", "MG482LDNHAC004", "MG482LDNHAC248", "MG482LDNHAC286", "MG482LDWHC001", "MG482LDWHC002", "MG482LDWHC004", "MG482LDWHC248", "MG482LDWHC286", "MG482LDWHAC001", "MG482LDWHAC002", "MG482LDWHAC004", "MG482LDWHAC248", "MG482LDWHAC286", "MH432LDBHC001", "MH432LDBHC003", "MH432LDBHAC001", "MH432LDBHAC003", "MH432LDFHC001", "MH432LDFHC003", "MH432LDFHAC001", "MH432LDFHAC003", "MH432LDNHC001", "MH432LDNHC003", "MH432LDNHAC001", "MH432LDNHAC003", "MH432LDWHC001", "MH432LDWHC003", "MH432LDWHAC001", "MH432LDWHAC003", "MHN21LDFHC003", "MHN21LDFHC007", "MHN21LDFHC039", "MHN21LDFHAC003", "MHN21LDFHAC007", "MHN21LDFHAC039", "MHN21LDNHC003", "MHN21LDNHC007", "MHN21LDNHC039", "MHN21LDNHAC003", "MHN21LDNHAC007", "MHN21LDNHAC039", "ML438LDBHC002", "ML438LDBHC014", "ML438LDBHC033", "ML438LDBHC107", "ML438LDBHAC002", "ML438LDBHAC014", "ML438LDBHAC033", "ML438LDBHAC107", "ML438LDFHC002", "ML438LDFHC014", "ML438LDFHC033", "ML438LDFHC107", "ML438LDFHAC002", "ML438LDFHAC014", "ML438LDFHAC033", "ML438LDFHAC107", "ML438LDNHC002", "ML438LDNHC014", "ML438LDNHC033", "ML438LDNHC107", "ML438LDNHAC002", "ML438LDNHAC014", "ML438LDNHAC033", "ML438LDNHAC107", "ML438LDWHC002", "ML438LDWHC014", "ML438LDWHC033", "ML438LDWHC107", "ML438LDWHAC002", "ML438LDWHAC014", "ML438LDWHAC033", "ML438LDWHAC107", "MN446LDBHC001", "MN446LDBHAC001", "MN446LDFHC001", "MN446LDFHAC001", "MN446LDNHC001", "MN446LDNHAC001", "MN446LDWHC001", "MN446LDWHAC001", "MN447LDBHC001", "MN447LDBHAC001", "MN447LDFHC001", "MN447LDFHAC001", "MN447LDNHC001", "MN447LDNHAC001", "MN447LDWHC001", "MN447LDWHAC001", "MN448LDBHC001", "MN448LDBHC002", "MN448LDBHAC001", "MN448LDBHAC002", "MN448LDFHC001", "MN448LDFHC002", "MN448LDFHAC001", "MN448LDFHAC002", "MN448LDNHC001", "MN448LDNHC002", "MN448LDNHAC001", "MN448LDNHAC002", "MN448LDWHC001", "MN448LDWHC002", "MN448LDWHAC001", "MN448LDWHAC002", "MN474LDBHC001", "MN474LDBHC003", "MN474LDBHAC001", "MN474LDBHAC003", "MN474LDFHC001", "MN474LDFHC003", "MN474LDFHAC001", "MN474LDFHAC003", "MN474LDNHC001", "MN474LDNHC003", "MN474LDNHAC001", "MN474LDNHAC003", "MN474LDWHC001", "MN474LDWHC003", "MN474LDWHAC001", "MN474LDWHAC003", "MN475LDBHC001", "MN475LDBHC002", "MN475LDBHAC001", "MN475LDBHAC002", "MN475LDFHC001", "MN475LDFHC002", "MN475LDFHAC001", "MN475LDFHAC002", "MN475LDNHC001", "MN475LDNHC002", "MN475LDNHAC001", "MN475LDNHAC002", "MN475LDWHC001", "MN475LDWHC002", "MN475LDWHAC001", "MN475LDWHAC002", "MN476LDBHC001", "MN476LDBHC002", "MN476LDBHAC001", "MN476LDBHAC002", "MN476LDFHC001", "MN476LDFHC002", "MN476LDFHAC001", "MN476LDFHAC002", "MN476LDNHC001", "MN476LDNHC002", "MN476LDNHAC001", "MN476LDNHAC002", "MN476LDWHC001", "MN476LDWHC002", "MN476LDWHAC001", "MN476LDWHAC002", "MN477LDBHC001", "MN477LDBHAC001", "MN477LDFHC001", "MN477LDFHAC001", "MN477LDNHC001", "MN477LDNHAC001", "MN477LDWHC001", "MN477LDWHAC001", "MQ417LDBHC043", "MQ417LDBHC044", "MQ417LDBHAC043", "MQ417LDBHAC044", "MQ417LDFHC043", "MQ417LDFHC044", "MQ417LDFHAC043", "MQ417LDFHAC044", "MQ417LDNHC043", "MQ417LDNHC044", "MQ417LDNHAC043", "MQ417LDNHAC044", "MQ417LDWHC043", "MQ417LDWHC044", "MQ417LDWHAC043", "MQ417LDWHAC044", "MS428LDBHC001", "MS428LDBHC002", "MS428LDBHC003", "MS428LDBHC004", "MS428LDBHAC001", "MS428LDBHAC002", "MS428LDBHAC003", "MS428LDBHAC004", "MS428LDFHC001", "MS428LDFHC002", "MS428LDFHC003", "MS428LDFHC004", "MS428LDFHAC001", "MS428LDFHAC002", "MS428LDFHAC003", "MS428LDFHAC004", "MS428LDNHC001", "MS428LDNHC002", "MS428LDNHC003", "MS428LDNHC004", "MS428LDNHAC001", "MS428LDNHAC002", "MS428LDNHAC003", "MS428LDNHAC004", "MS428LDWHC001", "MS428LDWHC002", "MS428LDWHC003", "MS428LDWHC004", "MS428LDWHAC001", "MS428LDWHAC002", "MS428LDWHAC003", "MS428LDWHAC004", "MS429LDBHC001", "MS429LDBHC002", "MS429LDBHAC001", "MS429LDBHAC002", "MS429LDFHC001", "MS429LDFHC002", "MS429LDFHAC001", "MS429LDFHAC002", "MS429LDNHC001", "MS429LDNHC002", "MS429LDNHAC001", "MS429LDNHAC002", "MS429LDWHC001", "MS429LDWHC002", "MS429LDWHAC001", "MS429LDWHAC002", "MS430LDBHC001", "MS430LDBHC003", "MS430LDBHC004", "MS430LDBHAC001", "MS430LDBHAC003", "MS430LDBHAC004", "MS430LDFHC001", "MS430LDFHC003", "MS430LDFHC004", "MS430LDFHAC001", "MS430LDFHAC003", "MS430LDFHAC004", "MS430LDNHC001", "MS430LDNHC003", "MS430LDNHC004", "MS430LDNHAC001", "MS430LDNHAC003", "MS430LDNHAC004", "MS430LDWHC001", "MS430LDWHC003", "MS430LDWHC004", "MS430LDWHAC001", "MS430LDWHAC003", "MS430LDWHAC004", "MS431LDBHC004", "MS431LDBHC006", "MS431LDBHC013", "MS431LDBHC017", "MS431LDBHC029", "MS431LDBHAC004", "MS431LDBHAC006", "MS431LDBHAC013", "MS431LDBHAC017", "MS431LDBHAC029", "MS431LDFHC004", "MS431LDFHC006", "MS431LDFHC013", "MS431LDFHC017", "MS431LDFHC029", "MS431LDFHAC004", "MS431LDFHAC006", "MS431LDFHAC013", "MS431LDFHAC017", "MS431LDFHAC029", "MS431LDNHC004", "MS431LDNHC006", "MS431LDNHC013", "MS431LDNHC017", "MS431LDNHC029", "MS431LDNHAC004", "MS431LDNHAC006", "MS431LDNHAC013", "MS431LDNHAC017", "MS431LDNHAC029", "MS431LDWHC004", "MS431LDWHC006", "MS431LDWHC013", "MS431LDWHC017", "MS431LDWHC029", "MS431LDWHAC004", "MS431LDWHAC006", "MS431LDWHAC013", "MS431LDWHAC017", "MS431LDWHAC029", "MS432LDBHC003", "MS432LDBHC004", "MS432LDBHC005", "MS432LDBHC006", "MS432LDBHC007", "MS432LDBHAC003", "MS432LDBHAC004", "MS432LDBHAC005", "MS432LDBHAC006", "MS432LDBHAC007", "MS432LDFHC003", "MS432LDFHC004", "MS432LDFHC005", "MS432LDFHC006", "MS432LDFHC007", "MS432LDFHAC003", "MS432LDFHAC004", "MS432LDFHAC005", "MS432LDFHAC006", "MS432LDFHAC007", "MS432LDNHC003", "MS432LDNHC004", "MS432LDNHC005", "MS432LDNHC006", "MS432LDNHC007", "MS432LDNHAC003", "MS432LDNHAC004", "MS432LDNHAC005", "MS432LDNHAC006", "MS432LDNHAC007", "MS432LDWHC003", "MS432LDWHC004", "MS432LDWHC005", "MS432LDWHC006", "MS432LDWHC007", "MS432LDWHAC003", "MS432LDWHAC004", "MS432LDWHAC005", "MS432LDWHAC006", "MS432LDWHAC007", "MS433LDBHC002", "MS433LDBHC004", "MS433LDBHC005", "MS433LDBHAC002", "MS433LDBHAC004", "MS433LDBHAC005", "MS433LDFHC002", "MS433LDFHC004", "MS433LDFHC005", "MS433LDFHAC002", "MS433LDFHAC004", "MS433LDFHAC005", "MS433LDNHC002", "MS433LDNHC004", "MS433LDNHC005", "MS433LDNHAC002", "MS433LDNHAC004", "MS433LDNHAC005", "MS433LDWHC002", "MS433LDWHC004", "MS433LDWHC005", "MS433LDWHAC002", "MS433LDWHAC004", "MS433LDWHAC005", "M075M0028C001", "M075M0028C006", "M075M0028C035", "M075M0028C403", "M075M0029C006", "M075M0029C014", "M075M0029C403", "M075M0038C001", "M075M0038C006", "M075M0038C035", "M075M0038C403", "M075M0068C001", "M075M0068C014", "M075M0068C035", "M075M1706C001", "M075M1706C006", "M075M1706C035", "M075M1706C403", "M075M1716C001", "M075M1716C006", "M075M1716C035", "M075M1716C403", "M075M1718C006", "M075M1718C403", "M075M1719C006", "M075M1719C014", "M075M1719C403", "M075M3008C001", "M075M3008C006", "M075M3008C014", "M075M3008C035", "M075M3008C403", "M075M3029C001", "M075M3029C006", "M075M3029C014", "M075M3029C035", "M075M3029C403", "M0UC40029C038", "M0UC40029C159", "M0UC41706C038", "M0UC41706C735", "M0UC41719C038", "M0UC41719C159", "M0UC41719C735", "M0UC43058C159", "M0UC43058C735", "M0UC44008C038", "M0UC44008C159", "MA6080028C017", "MA6080038C017", "MA6080068C017", "MA6081706C017", "MA6083008C017", "MA6083029C017", "MB6143029C019", "ME6240029C001", "ME6241706C001", "ME6241719C001", "ME6242758C001", "ME6243058C001", "ME6453029C4065", "ME6453029CL366", "ME6453029CW911", "ME6453039CW911", "MG6961706C015", "MG6961706C035", "MH6310029C560", "MH6311706C560", "MH6311719C560", "MH6312758C560", "MH6313058C560", "ML6303008CH235", "ML6303008CW363", "ML6930028C4008", "ML6930038C4008", "ML6930068C4008", "ML6931706C4003", "ML6931716C4008", "ML6933008C4008", "ML6933029C4008", "ML6940029C003", "ML6940029C008", "ML6941706C008", "ML6941719C003", "ML6941719C008", "ML6942758C003", "ML6942758C008", "ML6943038C003", "ML6943038C008", "ML6943058C003", "ML6943058C008", "MN6393029C013", "MN6393029C015", "MN6410028C015", "MN6410038C015", "MN6410068C015", "MN6411716C015", "MN6411718C015", "MN6413008C015", "MN6413029C015", "MN6510028C005", "MN6510028C030", "MN6510038C030", "MN6510068C005", "MN6510068C030", "MN6511706C005", "MN6511706C030", "MN6511716C005", "MN6511718C030", "MN6511728C030", "MN6513008C005", "MN6513008C030", "MN6513029C005", "MN6513029C030", "MN6543029C001", "MN6543029C005", "MN6543029C030", "MN6550028C404", "MN6550029C035", "MN6550029C461", "MN6550038C002", "MN6550038C404", "MN6550068C002", "MN6550068C404", "MN6551706C002", "MN6551706C035", "MN6551706C131", "MN6551706C404", "MN6551706C461", "MN6551706C928", "MN6551716C002", "MN6551718C002", "MN6551718C404", "MN6551719C035", "MN6551719C461", "MN6553008C002", "MN6553008C404", "MN6553029C002", "MN6553029C404", "MN6560028C093", "MN6560038C093", "MN6560068C093", "MN6561706C093", "MN6561718C093", "MN6563008C093", "MN6563029C093", "MN6701706C001", "MN6701706C007", "MR7160068C014", "MR7161706C010", "MR7161706C014", "MR7161706C017", "MR7161706C043", "MR7161716C014", "MR7161718C014", "MR7163008C014", "MR7163029C014", "MR7163038C014", "MR7163058C014", "MS6660029C001", "MS6660029C012", "MS6661706C001", "MS6661706C012", "MS6661719C001", "MS6661719C012", "MS6663058C001", "MS6663058C012", "MS6663058C013", "MW6351706C002", "MW6351706C004", "MW6351706C006", "MW6351706C008", "MD4107BBDC003", "MD4107BBDAC003", "MD4107BBDBC003", "MD4107BBDDC003", "MD4107BBDMC003", "MD4107BBDNC003", "MD4107BBDRC003", "MD4107BBDVC003", "MD4107BFDC003", "MD4107BFDAC003", "MD4107BFDBC003", "MD4107BFDDC003", "MD4107BFDMC003", "MD4107BFDNC003", "MD4107BFDRC003", "MD4107BFDVC003", "MD4107BNDC003", "MD4107BNDAC003", "MD4107BNDBC003", "MD4107BNDDC003", "MD4107BNDMC003", "MD4107BNDNC003", "MD4107BNDRC003", "MD4107BNDVC003", "MD4107BPDC003", "MD4107BPDAC003", "MD4107BPDBC003", "MD4107BPDDC003", "MD4107BPDMC003", "MD4107BPDNC003", "MD4107BPDRC003", "MD4107BPDVC003", "MD4107BTDC003", "MD4107BTDAC003", "MD4107BTDBC003", "MD4107BTDDC003", "MD4107BTDMC003", "MD4107BTDNC003", "MD4107BTDRC003", "MD4107BTDVC003", "MD4107BWDC003", "MD4107BWDAC003", "MD4107BWDBC003", "MD4107BWDDC003", "MD4107BWDMC003", "MD4107BWDNC003", "MD4107BWDRC003", "MD4107BWDVC003", "MD4107GDDC003", "MD4107GDDAC003", "MD4107GDDBC003", "MD4107GDDDC003", "MD4107GDDMC003", "MD4107GDDNC003", "MD4107GDDRC003", "MD4107GDDVC003", "MD4107GMDC002", "MD4107GMDC003", "MD4107GMDC006", "MD4107GMDC087", "MD4107GMDAC002", "MD4107GMDAC003", "MD4107GMDAC006", "MD4107GMDAC087", "MD4107GMDBC002", "MD4107GMDBC003", "MD4107GMDBC006", "MD4107GMDBC087", "MD4107GMDDC002", "MD4107GMDDC003", "MD4107GMDDC006", "MD4107GMDDC087", "MD4107GMDMC002", "MD4107GMDMC003", "MD4107GMDMC006", "MD4107GMDMC087", "MD4107GMDNC002", "MD4107GMDNC003", "MD4107GMDNC006", "MD4107GMDNC087", "MD4107GMDRC002", "MD4107GMDRC003", "MD4107GMDRC006", "MD4107GMDRC087", "MD4107GMDVC002", "MD4107GMDVC003", "MD4107GMDVC006", "MD4107GMDVC087", "MD4557BFDC001", "MD4557BFDC007", "MD4557BFDAC001", "MD4557BFDAC007", "MD4677BFDC009", "MD4677BFDC011", "MD4677BFDAC009", "MD4677BFDAC011", "MF4507BFDC001", "MF4507BFDC074", "MF4507BFDC176", "MF4507BFDC233", "MF4507BFDC276", "MF4507BFDAC001", "MF4507BFDAC074", "MF4507BFDAC176", "MF4507BFDAC233", "MF4507BFDAC276", "MF4597BFDC003", "MF4597BFDC005", "MF4597BFDC059", "MF4597BFDC079", "MF4597BFDC144", "MF4597BFDC240", "MF4597BFDAC003", "MF4597BFDAC005", "MF4597BFDAC059", "MF4597BFDAC079", "MF4597BFDAC144", "MF4597BFDAC240", "MG4647BFDC001", "MG4647BFDC002", "MG4647BFDAC001", "MG4647BFDAC002", "MG4657BFDC002", "MG4657BFDC003", "MG4657BFDAC002", "MG4657BFDAC003", "MG4827BFDC001", "MG4827BFDC002", "MG4827BFDC004", "MG4827BFDC248", "MG4827BFDC286", "MG4827BFDAC001", "MG4827BFDAC002", "MG4827BFDAC004", "MG4827BFDAC248", "MG4827BFDAC286", "MH2127BBDC9830", "MH2127BFDC158", "MH4327BFDC001", "MH4327BFDC003", "MH4327BFDAC001", "MH4327BFDAC003", "MHN217BTDUC003", "MHN217BTDUC007", "MHN217BTDUC039", "MHN217GMDC003", "MHN217GMDC007", "MHN217GMDC039", "MHN217GMDAC003", "MHN217GMDAC007", "MHN217GMDAC039", "MHN217GMDBC003", "MHN217GMDBC007", "MHN217GMDBC039", "MHN217GMDDC003", "MHN217GMDDC007", "MHN217GMDDC039", "MHN217GMDMC003", "MHN217GMDMC007", "MHN217GMDMC039", "MHN217GMDNC003", "MHN217GMDNC007", "MHN217GMDNC039", "MHN217GMDRC003", "MHN217GMDRC007", "MHN217GMDRC039", "MHN217GMDVC003", "MHN217GMDVC007", "MHN217GMDVC039", "ML4387BFDC002", "ML4387BFDC014", "ML4387BFDC033", "ML4387BFDC107", "ML4387BFDAC002", "ML4387BFDAC014", "ML4387BFDAC033", "ML4387BFDAC107", "MN4467BFDC001", "MN4467BFDAC001", "MN4477BFDC001", "MN4477BFDAC001", "MN4487BFDC001", "MN4487BFDC002", "MN4487BFDAC001", "MN4487BFDAC002", "MN4747BFDC001", "MN4747BFDC003", "MN4747BFDAC001", "MN4747BFDAC003", "MN4757BFDC001", "MN4757BFDC002", "MN4757BFDAC001", "MN4757BFDAC002", "MN4767BFDC001", "MN4767BFDC002", "MN4767BFDAC001", "MN4767BFDAC002", "MN4777BFDC001", "MN4777BFDAC001", "MQ4177BFDC043", "MQ4177BFDC044", "MQ4177BFDAC043", "MQ4177BFDAC044", "MR4407BBDC003", "MR4407BBDC014", "MR4407BBDAC003", "MR4407BBDAC014", "MR4407BBDBC003", "MR4407BBDBC014", "MR4407BBDDC003", "MR4407BBDDC014", "MR4407BBDMC003", "MR4407BBDMC014", "MR4407BBDNC003", "MR4407BBDNC014", "MR4407BBDRC003", "MR4407BBDRC014", "MR4407BBDVC003", "MR4407BBDVC014", "MR4407BEDC003", "MR4407BEDAC003", "MR4407BEDBC003", "MR4407BEDDC003", "MR4407BEDMC003", "MR4407BEDNC003", "MR4407BEDRC003", "MR4407BEDVC003", "MR4407BFDC003", "MR4407BFDC014", "MR4407BFDAC003", "MR4407BFDAC014", "MR4407BFDBC003", "MR4407BFDBC014", "MR4407BFDDC003", "MR4407BFDDC014", "MR4407BFDMC003", "MR4407BFDMC014", "MR4407BFDNC003", "MR4407BFDNC014", "MR4407BFDRC003", "MR4407BFDRC014", "MR4407BFDVC003", "MR4407BFDVC014", "MR4407BNDC003", "MR4407BNDC014", "MR4407BNDAC003", "MR4407BNDAC014", "MR4407BNDBC003", "MR4407BNDBC014", "MR4407BNDDC003", "MR4407BNDDC014", "MR4407BNDMC003", "MR4407BNDMC014", "MR4407BNDNC003", "MR4407BNDNC014", "MR4407BNDRC003", "MR4407BNDRC014", "MR4407BNDVC003", "MR4407BNDVC014", "MR4407BPDC003", "MR4407BPDC014", "MR4407BPDAC003", "MR4407BPDAC014", "MR4407BPDBC003", "MR4407BPDBC014", "MR4407BPDDC003", "MR4407BPDDC014", "MR4407BPDMC003", "MR4407BPDMC014", "MR4407BPDNC003", "MR4407BPDNC014", "MR4407BPDRC003", "MR4407BPDRC014", "MR4407BPDVC003", "MR4407BPDVC014", "MR4407BTDAC003", "MR4407BTDAC014", "MR4407BTDBC003", "MR4407BTDBC014", "MR4407BTDDC003", "MR4407BTDDC014", "MR4407BTDMC003", "MR4407BTDMC014", "MR4407BTDNC003", "MR4407BTDNC014", "MR4407BTDRC003", "MR4407BTDRC014", "MR4407BTDVC003", "MR4407BTDVC014", "MR4407BWDC003", "MR4407BWDC014", "MR4407BWDAC003", "MR4407BWDAC014", "MR4407BWDBC003", "MR4407BWDBC014", "MR4407BWDDC003", "MR4407BWDDC014", "MR4407BWDMC003", "MR4407BWDMC014", "MR4407BWDNC003", "MR4407BWDNC014", "MR4407BWDRC003", "MR4407BWDRC014", "MR4407BWDVC003", "MR4407BWDVC014", "MR4407GDDC003", "MR4407GDDC014", "MR4407GDDAC003", "MR4407GDDAC014", "MR4407GDDBC003", "MR4407GDDBC014", "MR4407GDDDC003", "MR4407GDDDC014", "MR4407GDDMC003", "MR4407GDDMC014", "MR4407GDDNC003", "MR4407GDDNC014", "MR4407GDDRC003", "MR4407GDDRC014", "MR4407GDDVC003", "MR4407GDDVC014", "MR4407GMDC003", "MR4407GMDC014", "MR4407GMDAC003", "MR4407GMDAC014", "MR4407GMDBC003", "MR4407GMDBC014", "MR4407GMDDC003", "MR4407GMDDC014", "MR4407GMDMC003", "MR4407GMDMC014", "MR4407GMDNC003", "MR4407GMDNC014", "MR4407GMDRC003", "MR4407GMDRC014", "MR4407GMDVC003", "MR4407GMDVC014", "MS4287BFDC001", "MS4287BFDC002", "MS4287BFDC003", "MS4287BFDC004", "MS4287BFDAC001", "MS4287BFDAC002", "MS4287BFDAC003", "MS4287BFDAC004", "MS4297BFDC001", "MS4297BFDC002", "MS4297BFDAC001", "MS4297BFDAC002", "MS4297BPDC001", "MS4307BFDC001", "MS4307BFDC003", "MS4307BFDC004", "MS4307BFDAC001", "MS4307BFDAC003", "MS4307BFDAC004", "MS4317BFDC004", "MS4317BFDC006", "MS4317BFDC013", "MS4317BFDC017", "MS4317BFDC029", "MS4317BFDAC004", "MS4317BFDAC006", "MS4317BFDAC013", "MS4317BFDAC017", "MS4317BFDAC029", "MS4327BFDC003", "MS4327BFDC004", "MS4327BFDC005", "MS4327BFDC006", "MS4327BFDC007", "MS4327BFDAC003", "MS4327BFDAC004", "MS4327BFDAC005", "MS4327BFDAC006", "MS4327BFDAC007", "MS4337BFDC002", "MS4337BFDC004", "MS4337BFDC005", "MS4337BFDAC002", "MS4337BFDAC004", "MS4337BFDAC005", "MD4107BTCC003", "MD4107BTCAC003", "MD4107BTCBC002", "MD4107BTCBC003", "MD4107BTCBC006", "MD4107BTCBC087", "MD4107BTCDC002", "MD4107BTCDC003", "MD4107BTCDC006", "MD4107BTCDC087", "MD4107BTCMC002", "MD4107BTCMC003", "MD4107BTCMC006", "MD4107BTCMC087", "MD4107BTCNC002", "MD4107BTCNC003", "MD4107BTCNC006", "MD4107BTCNC087", "MD4107BTCRC002", "MD4107BTCRC003", "MD4107BTCRC006", "MD4107BTCRC087", "MD4107BTCVC002", "MD4107BTCVC003", "MD4107BTCVC006", "MD4107BTCVC087", "MD4557BPCC001", "MD4557BPCC007", "MD4557BPCAC001", "MD4557BPCAC007", "MD4677BPCC009", "MD4677BPCC011", "MD4677BPCAC009", "MD4677BPCAC011", "MF4507BPCC001", "MF4507BPCC074", "MF4507BPCC176", "MF4507BPCC233", "MF4507BPCC276", "MF4507BPCAC001", "MF4507BPCAC074", "MF4507BPCAC176", "MF4507BPCAC233", "MF4507BPCAC276", "MF4597BPCC003", "MF4597BPCC005", "MF4597BPCC059", "MF4597BPCC079", "MF4597BPCC144", "MF4597BPCC240", "MF4597BPCAC003", "MF4597BPCAC005", "MF4597BPCAC059", "MF4597BPCAC079", "MF4597BPCAC144", "MF4597BPCAC240", "MG4647BPCC001", "MG4647BPCC002", "MG4647BPCAC001", "MG4647BPCAC002", "MG4657BPCC002", "MG4657BPCC003", "MG4657BPCAC002", "MG4657BPCAC003", "MG4827BPCC001", "MG4827BPCC002", "MG4827BPCC004", "MG4827BPCC248", "MG4827BPCC286", "MG4827BPCAC001", "MG4827BPCAC002", "MG4827BPCAC004", "MG4827BPCAC248", "MG4827BPCAC286", "MH4327BPCC001", "MH4327BPCC003", "MH4327BPCAC001", "MH4327BPCAC003", "MHN217BTCBC003", "MHN217BTCBC007", "MHN217BTCBC039", "MHN217BTCDC003", "MHN217BTCDC007", "MHN217BTCDC039", "MHN217BTCMC003", "MHN217BTCMC007", "MHN217BTCMC039", "MHN217BTCNC003", "MHN217BTCNC007", "MHN217BTCNC039", "MHN217BTCRC003", "MHN217BTCRC007", "MHN217BTCRC039", "MHN217BTCUC003", "MHN217BTCUC007", "MHN217BTCUC039", "MHN217BTCUC064", "MHN217BTCVC003", "MHN217BTCVC007", "MHN217BTCVC039", "ML4387BPCC002", "ML4387BPCC014", "ML4387BPCC033", "ML4387BPCC107", "ML4387BPCAC002", "ML4387BPCAC014", "ML4387BPCAC033", "ML4387BPCAC107", "MN4467BPCC001", "MN4467BPCAC001", "MN4477BPCC001", "MN4477BPCAC001", "MN4487BPCC001", "MN4487BPCC002", "MN4487BPCAC001", "MN4487BPCAC002", "MN4747BPCC001", "MN4747BPCC003", "MN4747BPCAC001", "MN4747BPCAC003", "MN4757BPCC001", "MN4757BPCC002", "MN4757BPCAC001", "MN4757BPCAC002", "MN4767BPCC001", "MN4767BPCC002", "MN4767BPCAC001", "MN4767BPCAC002", "MN4777BPCC001", "MN4777BPCAC001", "MQ4177BPCC043", "MQ4177BPCC044", "MQ4177BPCAC043", "MQ4177BPCAC044", "MR4407BPCC003", "MR4407BPCAC003", "MR4407BPCBC003", "MR4407BPCDC003", "MR4407BPCMC003", "MR4407BPCNC003", "MR4407BPCRC003", "MR4407BPCVC003", "MR4407BRCC003", "MR4407BRCAC003", "MR4407BRCBC003", "MR4407BRCDC003", "MR4407BRCMC003", "MR4407BRCNC003", "MR4407BRCRC003", "MR4407BRCVC003", "MR4407BTCC014", "MR4407BTCAC003", "MR4407BTCAC014", "MR4407BTCBC003", "MR4407BTCBC014", "MR4407BTCDC003", "MR4407BTCDC014", "MR4407BTCMC003", "MR4407BTCMC014", "MR4407BTCNC003", "MR4407BTCNC014", "MR4407BTCRC003", "MR4407BTCRC014", "MR4407BTCVC003", "MR4407BTCVC014", "MS4287BPCC001", "MS4287BPCC002", "MS4287BPCC003", "MS4287BPCC004", "MS4287BPCAC001", "MS4287BPCAC002", "MS4287BPCAC003", "MS4287BPCAC004", "MS4297BPCC001", "MS4297BPCC002", "MS4297BPCAC001", "MS4297BPCAC002", "MS4307BPCC001", "MS4307BPCC003", "MS4307BPCC004", "MS4307BPCAC001", "MS4307BPCAC003", "MS4307BPCAC004", "MS4317BPCC004", "MS4317BPCC006", "MS4317BPCC013", "MS4317BPCC017", "MS4317BPCC029", "MS4317BPCAC004", "MS4317BPCAC006", "MS4317BPCAC013", "MS4317BPCAC017", "MS4317BPCAC029", "MS4327BPCC003", "MS4327BPCC004", "MS4327BPCC005", "MS4327BPCC006", "MS4327BPCC007", "MS4327BPCAC003", "MS4327BPCAC004", "MS4327BPCAC005", "MS4327BPCAC006", "MS4327BPCAC007", "MS4337BPCC002", "MS4337BPCC004", "MS4337BPCC005", "MS4337BPCAC002", "MS4337BPCAC004", "MS4337BPCAC005", "MW4187BTCC028", "MW4187BTCC103", "MCIOTODAL1C999", "MCIOTODAL2C999", "MLAR90T001C002", "MLAR90T001C020", "MLAR90T001C021", "MLAR90T002C002", "MLAR90T002C020", "MLAR90T003C002", "MLAR90T003C020", "MLAR90T004C002", "MLAR90T004C020", "MLAR90T005C002", "MLAR90T005C020", "MLBICL0015CBIC", "MLBICL0016CBIC", "MLB541B012C7010", "MLB541B012C7968", "MLB541000AC7010", "MLB541000AC7968", "MLB541000EC7010", "MLB541000EC7968", "MLB541001DC7010", "MLB541001DC7968", "MLB541002DC7010", "MLB541002DC7968", "MLB541002EC7010", "MLB541002EC7968", "MLB650T04C020", "MLB650T04C159", "MLB925651C7220", "MLB925651C8041", "MLB925671C009", "MLB925671C7220", "MLB925671C8041", "MLB925674C009", "MLB925674C7220", "MLB925674C8041", "MLB925682C009", "MLB925682C7220", "MLB925682C8041", "MLB925914C7220", "MLB925914C8041", "MLB925933C7220", "MLB925933C8041", "MLB925943C7220", "MLB925943C8041", "MLB925953C7220", "MLB925953C8041", "MLB952112C021", "MLCANDVEA1CQ052", "MLCANDVEA2CQ052", "MLCANDVEA3CQ052", "MLCANDVEA4CQ052", "MLCANDVEB1CG275", "MLCANDVEB2CG275", "MLCANDVEB3CG275", "MLCANDVEB4CG275", "MLCANDVEC1CE613", "MLCANDVEC2CE613", "MLCANDVEC3CE613", "MLCANDVEC4CE613", "MLCAND32MCBROC", "MLCAND32MCBROM", "MLCAND32MCBROS", "MLCAND32MCGROC", "MLCAND32MCGROM", "MLCAND32MCGROS", "MLCAND32MCVERD", "MLCAND32MC076", "MLCAND32MC101", "MLCAND32MC132", "MLCAND320CBROC", "MLCAND320CBROM", "MLCAND320CBROS", "MLCAND320CGROC", "MLCAND320CGROM", "MLCAND320CGROS", "MLCAND320CVERD", "MLCAND320C076", "MLCAND320C101", "MLCAND320C132", "MLCER0001CH367", "MLCER0002CH367", "MLCER0003CH367", "MLCER0004CH367", "MLCER0005CH367", "MLCER0006CH367", "MLCER0007CH367", "MLCER0008CH367", "MLCER0009CH367", "MLCER0010CH367", "MLCORP001CBION", "MLCORP002CBION", "MLCORP003CBION", "MLCORP004CBION", "MLCORP005CBION", "MLCORP006CBION", "MLCORP007CBION", "MLCORP008CBION", "MLDEOGESA1CDEO", "MLDEOGESB1CDEO", "MLDEOGESC1CDEO", "MLDEORICA1CDEO", "MLDEORICB1CDEO", "MLDEORICC1CDEO", "MLLANTTRE1C058", "MLLANTTRE1C132", "MLLANTTRE2C058", "MLLANTTRE2C132", "MLMUGCER1CG324", "MLPOPEN001C001", "MLPOTCER1CG324", "MLSETCER1CG324", "MLSETCER2CG324", "MLSETCER3CG324", "MLSETCER4CG324", "MLTABL0015CBIC", "MLTABL0016CBIC", "MLTABL0017CW031", "MLTABL0018CW031", "MLTABL0019CW031", "MLTABL0030CW031", "MLTABL0031CW031", "MLTABL0032C806", "MLTABL0033C806", "MLTABL0034C806", "MLTABL0035C806", "MLVASCER1CG324", "MLVASCER2CG324", "MLVASCER3CG324", "MLWOGAM714CSET1", "MLWOGAM717CSET1", "MLWOGAM720CA815", "MLWOGAM725CSET2", "MLWOGAM814CSET1", "MLWOGAM817CSET1", "MLWOGAM820CSET1", "MLWOGAM821CSET1", "MLWRITE818CSET1", "ML05NL038C080", "ML05NL038C2430", "ML05NL038C8003", "ML05NL039C080", "ML05NL039C2430", "ML05NL039C8003", "ML1205D01C079", "ML1205D01C9443", "ML1205D01C9448", "ML1205D01C9455", "ML1205D02C079", "ML1205D02C9443", "ML1205D02C9448", "ML1205D02C9455", "ML1205500C079", "ML1205500C2719", "ML1205500C9276", "ML1205500C9443", "ML1205500C9448", "ML1205500C9455", "ML1205501C079", "ML1205501C2719", "ML1205501C9276", "ML1205501C9443", "ML1205501C9448", "ML1205501C9455", "ML1382951TC2719", "ML1382951VC2719", "ML1382951VC9276", "ML1382952TC9455", "ML1382952TC9456", "ML1382952VC9455", "ML1382952VC9456", "ML7305E01CJ079", "ML7305E01C9443", "ML7305E01C9455", "ML7305E02CJ079", "ML7305E02C9443", "ML7305E02C9455", "MNAG90133C080", "MPAG90130C079", "MPAG90130C2719", "MPAG90130C9138", "MPAG90130C9276", "MPAG90130C9443", "MPAG90130C9448", "MPAG90130C9455", "MPAG90133C013", "MPAG90133C321", "MPAG90133C326", "MPAG90134C021", "MPAG90134C023", "MPAG90134C127", "MPAG90141CP122", "MPAG90141CT140", "MPAG90150CK289", "MPAG91141CP122", "MPAG91141CT140", "MPAR90131CJ141", "MPAR90131CM407", "MPCANG000C2350", "MPCANP000C2350", "MPCUCO000C159", "MPCULE000C101", "MPCUWO000C159", "MPCUWS000C159", "MPHW00001C079", "MPHW00002C079", "MPHW00003C079", "MPLA98152CA380", "MPLA98152CP61", "MPLC99921CF461", "MPOGGCO01C159", "MPOGGCO02C159", "MPOGGCO03C159", "MPPLCO000C159", "MPPLWO000C159", "MPSPUCO001C159", "MPSPUCO002C159", "MPSPUCO003C159", "MBSMD1353C101", "MBSMD1353C5859", "MBSMD1353C7831", "MBSMD2179C101", "MBSMD2179C5859", "MBSMD2179C7831", "MBSMD2180C101", "MBSMD2180C5859", "MBSMD2180C7831", "MBSMD2181C101", "MBSMD2181C5859", "MBSMD2181C7831", "M0091MA206C159", "M0091MA226C159", "M12144400C077", "M12144400C078", "M12144400C079", "M12144400C101", "M12144400C159", "M12144400C2642", "M12144400C2719", "M12144400C2803", "M12144400C7186", "M12144400C9276", "M12144400C9435", "M12144400C9436", "M12144400CG266", "M12144400CN058", "M12144402C077", "M12144402C079", "M12144402C101", "M12144402C159", "M12144402C2642", "M12144402C2719", "M12144402C2803", "M12144402C7186", "M12144402C9276", "M12144402C9443", "M12144402C9456", "M12144402CG266", "M12144402CN058", "M12144406C101", "M12144406C159", "M12144406C2642", "M12144406C2803", "M12144406C7186", "M12144406C9276", "M12144406C9443", "M12144406C9456", "M12144406CG266", "M12150103C078", "M12150103C079", "M12150103C101", "M12150103C159", "M12150103C2719", "M12150103C2803", "M12150103C9276", "M12150103C9443", "M12150103C9456", "M12150103CG266", "M12150103CN058", "M12150140C077", "M12150140C078", "M12150140C101", "M12150140C7186", "M12150140C9276", "M12150140C9443", "M12150140CG266", "M12150140CN058", "M62450034C079", "M62450034C101", "M62450042C079", "M62450042C101", "M62450042C2358", "M62450063C055", "M62450063C101", "M62450063C2358", "MD828SB806C570", "MD828SB806C571", "MD828SB806C572", "MD828SB806C575", "MD828SB806C8398", "MH827SA306C055", "MH827SA306C080", "MH827SA306C101", "MH827SA306C2430", "MH827SA306C600", "MH827SA309C055", "MH827SA309C080", "MH827SA309C101", "MH827SA309C600", "M13800000C055", "M13800000C058", "M13800000C079", "M13800000C101", "M13800000C159", "M13800000C2642", "M13800000C9443", "M13800008C055", "M13800008C058", "M13800008C079", "M13800008C101", "M13800008C159", "M13800008C2642", "M13800008C7186", "M13800008C9443", "M13800008C9456", "M13800063C055", "M13800063C058", "M13800063C079", "M13800063C101", "M13800063C159", "M13800063C2642", "M13800063C7186", "M13800063C9443", "M13800063C9456", "M13811118C055", "M13811118C101", "M13811118C159", "M13811118C2642", "M13811118C7186", "M41800000C101", "M41800000C2642", "M41800000C2803", "M41800000C9436", "M41800000C9443", "M41800000C9456", "M41800008C067", "M41800008C101", "M41800008C2642", "M41800008C2803", "M41800008C9436", "M41800008C9443", "M41800008C9456", "M41800032C101", "M41800032C2803", "M41800032C9443", "M41800032C9456", "M41800063C067", "M41800063C101", "M41800063C2642", "M41800063C2803", "M41800063C9436", "M41800063C9443", "M41800063C9456", "M41810000C067", "M41810000C101", "M41810000C2642", "M41810000C2803", "M41810000C9436", "M41810000C9443", "M41810000C9456", "M41822900C101", "M41822900C2642", "M41822900C2803", "M41822900C9443", "M41822900C9456", "M41822902C067", "M41822902C101", "M41822902C2803", "M41822902C9443", "M41822903C067", "M41822903C101", "M41822903C2642", "M41822903C9443", "M41822904C101", "M41822904C2642", "M41822904C2803", "M12169106C078", "M12169106C101", "M12169106C159", "M12169106C2719", "M12169106C2642", "M12169106C7186", "M12169106C9276", "M12169106C9436", "M12169106C9443", "M12169106C9456", "M12169106CA590", "M12169106CG266", "M12169106CN058", "MD828SB899C570", "MD828SB899C571", "MD828SB899C572", "MD828SB899C575", "MD828SB899C8398", "MH827SA399C055", "MH827SA399C080", "MH827SA399C101", "MH827SA399C2430", "MH827SA399C600", "M12169199C078", "M12169199C079", "M12169199C101", "M12169199C159", "M12169199C2642", "M12169199C2803", "M12169199C7186", "M12169199C9276", "M12169199C9436", "M12169199C9443", "M12169199C9456", "M12169199CA590", "M12169199CG266", "M12169199CN058", "M0H43P5524C101", "M0H43P5524C600", "MB005P5553C7798", "MB005P5553C7799", "MH137P5495C101", "MH137P5495C600", "MH137P5495C159", "MH137P5553C101", "MH137P5553C600", "MH137P5553C159", "MA029P1673C101", "MA029P1673C2355", "MA029P1673C600", "MA029P1673C8525", "MA126P7258C9456", "MWMON1316C2126", "MWMON1352C2126", "MWMON1352CW122", "MWMON1354C2126", "MWMON1354CW122", "MWSMD1352C101", "MWSMD1352C7831", "MWSMD1354C101", "MWSMD1354C5859", "MWSMD1354C7831", "MWSMD1451C101", "MWSMD1451C7891", "MWVED1000C2126", "MWVED1000C7831", "MWVED1352C2126", "MWVED1352C7831", "MWVED1354C2126", "MWVED1354C7831", "MZPRC1961C101", "MZPRC1961C6643", "MZPRC1965C101", "MZPRC1965C6643", "MZSFG1960C101", "MZSFG1960C6280", "MSC915029C101", "MSC915029C159", "MSC915029C2355", "MSC915029C2642", "MSC915029C2803", "MSC915029C7186", "MSC915029C9443", "MSC915029C9456", "MSC915029CJ079", "MSC915029CJ159", "MSC915029CN058", "MSC924059C077", "MSC924059C078", "MSC924059C079", "MSC924059C101", "MSC924059C159", "MSC924059C2355", "MSC924059C2642", "MSC924059C2803", "MSC924059C7186", "MSC924059C9276", "MSC924059C9443", "MSC924059CN058", "MSCDAR097C055", "MSCDAR097C079", "MSCDAR097C101", "MSCDAR097C159", "MSCDAR097C2355", "MSCDAR097C2642", "MSCDAR097C7186", "MSCDAR097C9443", "MSCDAR097CN058", "MSCDVSW03C055", "MSCDVSW03C058", "MSCDVSW03C079", "MSCDVSW03C101", "MSCDVSW03C159", "MSCDVSW03C2642", "MSCDVSW03C2803", "MSCDVSW03C7186", "MSCDVSW03C9276", "MSCDVSW03CJ159", "M0C59E0600C079", "M0C59E0600C101", "M0C59E0600C159", "M0C59E0600C2350", "M0C59E0600C2355", "M0C59E0600C600", "M0C59E0600C7186", "M0C59E0600C8553", "M0C59E0600C9443", "M0C59E0602C079", "M0C59E0602C101", "M0C59E0602C2350", "M0C59E0602C2355", "M0C59E0602C600", "M0C59E0602C159", "M0C59E0602C7186", "M0C59E0602C8553", "M0C59E0602C9443", "M0T1802B17C080", "M0T1802B17C101", "M0T1802B17C159", "M0T1802B17C600", "M0T18B0107C055", "M0T18B0107C080", "M0T18B0107C101", "M0T18B0107C600", "M0T18B0107C159", "M0T18B0107CU896", "M0T18B0112C055", "M0T18B0112C101", "M0T18B0112C159", "M0T18B0112C600", "M0T18B0112C7186", "M0T18B0112CU896", "M0T18B0150C055", "M0T18B0150C159", "M0T18B0160C055", "M0T18B0160C080", "M0T18B0160C101", "M0T18B0160C159", "M0T18B0160C600", "M0T18B0160C7186", "M0T18B0170C055", "M0T18B0170C080", "M0T18B0170C101", "M0T18B0170C159", "M0T18B0170C600", "M0T18B0170CU896", "M0T18B0180C055", "M0T18B0180C101", "M0T18B0180C159", "M0T18B0180C600", "M0T18B0180C7186", "M0T18BA702C055", "M0T18BA702C080", "M0T18BA702C101", "M0T18BA702C159", "M0T18BA702CU896", "M0TC836S10C055", "M0TC836S10C080", "M0TC836S10C101", "M0TC836S10C159", "M0TC836S10C600", "M0TC836S10C7186", "M0TC836S10CU896", "M0TC836S14C055", "M0TC836S14C080", "M0TC836S14C600", "M0TC836S14CU896", "M0TC836S50C080", "M0TC836S50C101", "M0TC836S50C159", "M0TC836S50C600", "M0TC836S50C7186", "M0TC836S50CU896", "M0TC836S60C055", "M0TC836S60C080", "M0TC836S60C159", "M0R25A4643C036", "M0R25A4643C051", "M0R25A4643C796", "M41818A94C101", "M41818A94C2803", "M0091MF106C159", "M0091MF116C159", "M12150104C079", "M12150104C101", "M12150104C159", "M12150104C7186", "M12150106C101", "M12150106C159", "M12150106C7186", "M12150106C9443", "M12150106CG266", "M12150124C101", "M12150124C159", "M12150124C7186", "M12150124C9443", "M12150152C101", "M12150152C159", "M12150152C9276", "M12150152C9443", "M12150152CN058", "M12150180C2719", "M12711023C101", "M12711023C159", "M12711023C2642", "M12711023C7186", "M12711023C9436", "M12711023C9443", "M12712116C101", "M12712116C2803", "M12712116C7186", "M12712116C9276", "M12712116C9443", "M73539900C101", "M73539900C2803", "M73539900C7186", "M73539900C9443", "M73539900CJ079", "M73539900CJ159", "M73539900CN058", "M73539902C101", "M73539902C2719", "M73539902C2803", "M73539902C7186", "M73539902C9443", "M73539902CJ079", "M73539902CJ159", "M73539902CN058", "M73539903C101", "M73539903C2719", "M73539903C2803", "M73539903C7186", "M73539903C9443", "M73539903CJ079", "M73539903CJ159", "M73539903CN058", "M73539916C101", "M73539916C2803", "M73539916C7186", "M73539916C9443", "M73539916CJ159", "M73539916CN058", "M73539926C101", "M73539926C2719", "M73539926C2803", "M73539926C7186", "M73539926C9443", "M73539926CJ079", "M73539926CJ159", "M73539926CN058", "MH827SC806C055", "MH827SC806C080", "MH827SC806C101", "MH827SC806C600", "MH827SC809C055", "MH827SC809C080", "MH827SC809C101", "MH827SC809C600", "M13800002C055", "M13800002C079", "M13800002C101", "M13800002C159", "M13800002C2719", "M13800002C7186", "M13800002C9443", "M13800002C9456", "M41810030C101", "M41810030C2642", "M41810030C2803", "M41810030C9443", "M12164806C159", "M12164806C9276", "M12164806C9443", "M12164806CG266", "MH827SC899C055", "MH827SC899C080", "MH827SC899C101", "MH827SC899C600", "MH827SD299C055", "MH827SD299C080", "MH827SD299C101", "MH827SD299C600", "M12164899C159", "M12164899C9276", "M12164899C9443", "M12164899CG266", "MA080P5398C9443", "MT2269582C003", "MT2269582C004", "M0T18BB300C055", "M0T18BB300C159", "M0T18BB310C055", "M0T18BB310C159", "MZANG1815C7592", "MZANG1815C101", "MZMMC1569C7620", "MBMMD2017C7620", "MAFJ9L019CORO", "MAFJ9L020CORO", "MAFJ9L021CORO", "MAFJ9L024CORO", "MBFJ9L017CORO", "MBFJ9L018CORO", "MCFJ9L015CORO", "MCFJ9L028CORO", "MOFJ9L010CORO", "MOFJ9L013CORO", "MOFJ9L014CORO", "MOFJ9L025CORO", "M0PVI3080C1666", "M0NBGASW11C7872", "MBHSD2159C7832", "MF940DN306CA236", "M12717800CP054", "M12717899CP054", "M52362606CV859", "M8M559000CN796", "M8M559014CQ149", "M8M559004CP411", "MA180P7515C8537", "MB526P7531C8505", "MA180P7516C8501", "MB591P7539C001", "MAB397106C3528", "MBFKD2200C7890", "MBFKD2198C7615", "MAB397299C3528", "M2E811A93C073", "MB5918247C001", "MZATG1914C7830", "MAFJ9L014CORO", "MAFJ9L022CORO", "MAFJ9L029CORO", "MBFJ9L007CORO", "MBFJ9L008CORO", "MBFJ9L009CORO", "MBFJ9L010CORO", "MBFJ9L021CORO", "MBFJ9L026CORO", "MBFJ9L032CORO", "MCFJ9L001CORO", "MCFJ9L002CORO", "MCFJ9L003CORO", "MCFJ9L004CORO", "MCFJ9L005CORO", "MCFJ9L006CORO", "MCFJ9L006CO952", "MCFJ9L020CORO", "MCFJ9L023CORO", "MCFJ9L027CORO", "MOFJ9L011CORO", "MOFJ9L012CORO", "MOFJ9L028CORO", "MOFJ9L031CORO", "MOFJ9L033CORO"];
},{}],"components/EditOrder.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _constructUi = require("construct-ui");

var _Nav = require("./Nav");

var _Searches = require("./Searches");

var _Orders = require("./Orders");

var _noSaleAI = require("../noSaleAI20");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function AssignedSearch() {
  var imgSrc = '';
  return {
    view: function view(vnode) {
      var item = vnode.attrs.search;
      var content = (0, _mithril.default)('.search-popover', [(0, _mithril.default)("img[src=".concat(imgSrc, "][style= padding: .5rem; border-radius:10px; display: block;]"), {
        label: 'click',
        oninit: function oninit() {
          fetch("api/image/".concat(item.year, "/").concat(item.season, "/").concat(item.model), {
            headers: {
              smurf: localStorage.smurf
            }
          }).then(function (res) {
            return res.text();
          }).then(function (url) {
            imgSrc = url;

            _mithril.default.redraw();
          });
        }
      })]);
      return (0, _mithril.default)(".cui-list-item.list-item-".concat(vnode.attrs.index), [(0, _mithril.default)(_constructUi.Button, {
        iconLeft: _constructUi.Icons.MINUS_SQUARE,
        // intent: 'negative',
        basic: true,
        compact: true,
        size: 'xs',
        class: 'remove-search',
        onclick: function onclick(e) {
          //UNASSIGN SEARCH
          e.preventDefault();
          e.stopPropagation();

          _mithril.default.request({
            method: 'GET',
            url: "/api/addToClient/unassigned/".concat(item._id)
          }).then(function () {
            var removedSearch = vnode.attrs.assignedSearches.splice(vnode.attrs.index, 1)[0];

            _Searches.Searches.unassignedSearches.push(removedSearch);

            (0, _Nav.showToast)("Unassigned ".concat(item.model), 'warning');
          });
        }
      }), (0, _mithril.default)('.left-content[style=text-align:left;]', (0, _mithril.default)('.sku-detail.label', "".concat(item.year).concat(item.season, " ").concat(item.model, " ").concat(item.color, " ").concat(item.size)), (0, _mithril.default)(_constructUi.Tag, {
        label: item.descr
      })), (0, _mithril.default)('.right-content[style=overflow:hidden;]', // m(Select, {
      //   size: 'xs',
      //   fluid: true,
      //   options: ['NEG1', 'DOS', 'N/A', 'ECOMM', 'HQ']
      // }),
      (0, _mithril.default)(_constructUi.Tag, {
        label: "\u20AC".concat(item.price),
        intent: 'warning'
      }) // m(Select, {
      //   size: 'xs',
      //   basic: true,
      //   style: 'margin-right:10px;',
      //   options: ['N/A', 'NEG1', 'DOS', 'ECOMM', 'HQ']
      // })
      )]);
    }
  };
}

function UnassignedSearch() {
  return {
    assignOrder: function assignOrder(order, searchId, index) {
      _mithril.default.request({
        method: 'GET',
        url: "/api/addToClient/".concat(order.id, "/").concat(searchId)
      }).then(function (res) {
        console.log(res);

        var removedSearch = _Searches.Searches.unassignedSearches.splice(index, 1)[0];

        (0, _Nav.showToast)("Assigned ".concat(res.model, "!"), 'positive');

        _Searches.Searches.assignedSearches[order.id].push(removedSearch);
      });
    },
    view: function view(vnode) {
      var item = vnode.attrs.item;
      var order = vnode.attrs.order;
      var index = vnode.attrs.index; // let contentR = m('.right-content[style=overflow:hidden;]',
      //   m(Tag, {
      //     label: item.descr,
      //   }),
      //   m(Tag, {
      //     label: item.price,
      //     intent: 'warning'
      //   })
      // )
      // let contentLeft = m('.left-content.flex[style=flex-wrap:nowrap;align-items:center;]',
      //   m(Button, {
      //     iconLeft: Icons.PLUS_SQUARE,
      //     // intent: 'positive',
      //     compact: true,
      //     basic: true,
      //     size: 'xs',
      //     style: 'height: 100%',
      //     onclick: (e) => {
      //       // ASSIGN SEARCH
      //       e.preventDefault()
      //       let searchId = item._id
      //       vnode.state.assignOrder(order, searchId, index)
      //     }
      //   }), m('.sku-info', m('.sku-detail.label', `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`)))
      // const trigger = m(ListItem, {
      //   // label: `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`,
      //   contentRight: contentR,
      //   contentLeft: contentLeft
      // })
      // return m(Popover, {
      //   closeOnEscapeKey: true,
      //   closeOnContentClick: false,
      //   inline: true,
      //   hasArrow: true,
      //   position: 'top',
      //   trigger,
      //   content: m('.search-popover', m(Tag, {
      //     fluid: true,
      //     label: item.descr
      //   }))
      // })

      return (0, _mithril.default)(".cui-list-item.list-item-".concat(vnode.attrs.index), [(0, _mithril.default)(_constructUi.Button, {
        iconLeft: _constructUi.Icons.PLUS_SQUARE,
        // intent: 'positive',
        compact: true,
        basic: true,
        size: 'xs',
        style: 'height: 100%',
        onclick: function onclick(e) {
          // ASSIGN SEARCH
          e.preventDefault();
          var searchId = item._id;
          vnode.state.assignOrder(order, searchId, index);
        }
      }), (0, _mithril.default)('.left-content[style=text-align:left;]', (0, _mithril.default)('.sku-detail.label', "".concat(item.year).concat(item.season, " ").concat(item.model, " ").concat(item.color, " ").concat(item.size)), (0, _mithril.default)(_constructUi.Tag, {
        label: item.descr
      })), (0, _mithril.default)('.right-content[style=overflow:hidden;]', (0, _mithril.default)(_constructUi.Tag, {
        label: "\u20AC".concat(item.price),
        intent: 'warning'
      }))]);
    }
  };
}

var EditOrder = {
  order: {},
  maxWidth: 'none',
  assignedSearches: [],
  total: 0,
  pieces: 0,
  loadAssignedSearches: function loadAssignedSearches(id) {
    return _mithril.default.request({
      url: "/api/".concat(id, "/SearchInstances")
    }).then(function (res) {
      return res;
    });
  },
  loadUnassignedSearches: function loadUnassignedSearches() {
    return _mithril.default.request({
      method: 'GET',
      url: '/api/SearchInstances/unassigned'
    }).then(function (res) {
      return res;
    });
  },
  loadOrder: function loadOrder(id) {
    return _mithril.default.request({
      method: 'GET',
      url: "/api/order/".concat(id)
    }).then(function (res) {
      return res;
    });
  },
  oninit: function () {
    var _oninit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(vnode) {
      var order;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              order = _Orders.Orders.ordersList.length > 0 ? _Orders.Orders.ordersList.filter(function (item) {
                return item.id == vnode.attrs.id;
              })[0] : null;
              _Searches.Searches.searchesList.length > 0 ? null : _Searches.Searches.loadSearches();
              _context.t0 = order;

              if (_context.t0) {
                _context.next = 7;
                break;
              }

              _context.next = 6;
              return vnode.state.loadOrder(vnode.attrs.id);

            case 6:
              _context.t0 = _context.sent;

            case 7:
              vnode.state.order = _context.t0;
              vnode.state.assignedSearches = _Searches.Searches.assignedSearches[vnode.attrs.id] ? _Searches.Searches.assignedSearches[vnode.attrs.id] : _Searches.Searches.assignedSearches[vnode.attrs.id] = [];

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function oninit(_x) {
      return _oninit.apply(this, arguments);
    }

    return oninit;
  }(),
  view: function view(vnode) {
    var order = vnode.state.order;
    return [(0, _mithril.default)(_Nav.Nav), (0, _mithril.default)('.edit-order-wrapper.container', [(0, _mithril.default)('.title#client-name', (0, _mithril.default)('h2', "".concat(vnode.state.order.clientName, "'s Order")), (0, _mithril.default)('.flex.space-b.labels', [(0, _mithril.default)(_constructUi.Tag, {
      label: vnode.state.order._id,
      size: 'xs'
    }), (0, _mithril.default)(_constructUi.Button, {
      iconLeft: _constructUi.Icons.TRASH,
      label: 'Clear Items',
      compact: true,
      // basic: true,
      outlined: true,
      intent: 'negative',
      onclick: function onclick() {
        _mithril.default.request({
          method: 'DELETE',
          url: '/api/deleteAssignedSearches/',
          headers: {
            order: vnode.state.order._id
          }
        }).then(function (res) {
          (0, _Nav.showToast)("Deleted ".concat(res, " items!"), 'none');

          _Searches.Searches.loadSearches();
        });
      }
    })])), (0, _mithril.default)('.searches.grid', [(0, _mithril.default)('.assigned-searches', (0, _mithril.default)('h3', 'Assigned Searches'), (0, _mithril.default)(_constructUi.List, {
      size: 'xs',
      interactive: false // style: `max-width: ${vnode.state.maxWidth};`

    }, vnode.state.assignedSearches.length > 0 ? vnode.state.assignedSearches.map(function (search, i) {
      if (vnode.state.pieces < vnode.state.assignedSearches.length) {
        vnode.state.pieces += 1;
        vnode.state.total += parseInt(search.price);
        console.log(vnode.state);
      }

      return (0, _mithril.default)(AssignedSearch, {
        search: search,
        index: i,
        key: i,
        assignedSearches: vnode.state.assignedSearches
      });
    }) : null), (0, _mithril.default)('.row.totals', [(0, _mithril.default)(_constructUi.Tag, {
      label: "pcs: ".concat(vnode.state.pieces)
    }), (0, _mithril.default)(_constructUi.Tag, {
      intent: 'primary',
      label: "total: \u20AC".concat(vnode.state.total)
    })])), (0, _mithril.default)('.unassigned-searches', (0, _mithril.default)('h3', 'Unassigned Searches'), (0, _mithril.default)(_constructUi.List, {
      size: 'xs',
      interactive: false,
      style: "max-height: 65vh;"
    }, _Searches.Searches.unassignedSearches.map(function (item, i) {
      return (0, _mithril.default)(UnassignedSearch, {
        item: item,
        order: order,
        index: i,
        unassignedSearches: vnode.state.unassignedSearches
      });
    })))])])];
  }
};
module.exports = EditOrder;
},{"mithril":"../node_modules/mithril/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js","./Nav":"components/Nav.js","./Searches":"components/Searches.js","./Orders":"components/Orders.js","../noSaleAI20":"noSaleAI20.js"}],"app.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _mithril = _interopRequireDefault(require("mithril"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _constructUi = require("construct-ui");

require("../node_modules/construct-ui/lib/index.css");

var _logo = _interopRequireDefault(require("./logo.svg"));

var _login = require("/components/login");

var _Nav = require("/components/Nav");

var _EditClient = _interopRequireDefault(require("/components/EditClient"));

var _Searches = require("/components/Searches");

var _Richieste = require("/components/Richieste");

var _EditOrder = _interopRequireDefault(require("/components/EditOrder"));

var _noSaleAI = require("./noSaleAI20");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var socket = (0, _socket.default)('http://localhost:3000');
socket.on('connect', function () {});
socket.on('message-client-connected', function (msg) {
  console.log(msg);
});

_constructUi.FocusManager.alwaysShowFocus();

var _require = require('/components/Tabs'),
    ordersSection = _require.ordersSection,
    clientsSection = _require.clientsSection,
    historySection = _require.historySection;

var Login = {
  remember: false,
  user: localStorage.user,
  pwd: localStorage.pwd,
  oninit: function oninit(vnode) {
    if (localStorage.pwd) {
      vnode.state.remember = true;
    } // login.check()

  },
  view: function view(vnode) {
    return [(0, _mithril.default)('form.login', (0, _mithril.default)('.logo-bg', {
      style: "width: auto; height: 100px; background: url(".concat(_logo.default, ") no-repeat center;")
    }), (0, _mithril.default)(_constructUi.Input, {
      style: 'display:block;margin:5px auto;',
      value: vnode.state.user,
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.USER
      }),
      placeholder: 'Your ASWEB Username',
      autocomplete: 'username',
      oncreate: function oncreate(e) {
        console.log(e, localStorage);
        e.dom.value = localStorage.user;
      },
      oninput: function oninput(e) {
        vnode.state.user = e.srcElement.value;
      }
    }), (0, _mithril.default)(_constructUi.Input, {
      style: 'display:block;margin:5px auto;',
      value: vnode.state.pwd,
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.LOCK
      }),
      placeholder: 'Password',
      type: 'password',
      autocomplete: "current-password",
      oncreate: function oncreate() {// console.log(e);
      },
      oninput: function oninput(e) {
        vnode.state.pwd = e.srcElement.value;
      }
    }), (0, _mithril.default)(_constructUi.Button, {
      label: 'LOGIN',
      style: 'display:block;margin:5px auto;',
      type: 'submit',
      intent: 'primary',
      onclick: function () {
        var _onclick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  console.log('clicked');
                  e.preventDefault();
                  _context.next = 4;
                  return _login.login.authenticate(vnode.state.remember, vnode.state.user, vnode.state.pwd);

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function onclick(_x) {
          return _onclick.apply(this, arguments);
        }

        return onclick;
      }()
    }), (0, _mithril.default)(_constructUi.Switch, {
      label: 'Remember me',
      style: 'display: block;margin: auto;margin-top: 1rem;',
      checked: vnode.state.remember,
      onchange: function onchange() {
        vnode.state.remember = !vnode.state.remember;
      }
    }))];
  }
};
var Home = {
  results: [],
  size: 'xl',
  view: function view() {
    return (0, _mithril.default)('.main', (0, _mithril.default)(_Nav.Nav), (0, _mithril.default)('.search', (0, _mithril.default)('h1', 'Disponibilità'), (0, _mithril.default)('.search-form', (0, _mithril.default)(SearchForm))), (0, _mithril.default)('.results', Home.results.map(function (item, i) {
      return (0, _mithril.default)('.sku-wrapper-key', {
        key: item.id
      }, (0, _mithril.default)(Sku, {
        sku: item,
        i: i
      }));
    })));
  }
};
var SearchForm = {
  loading: false,
  clearResults: function clearResults() {
    return Home.results = [];
  },
  // oninit: login.check,
  view: function view(vnode) {
    return (0, _mithril.default)("form", [(0, _mithril.default)("div.model", //m("input.model-input.twelve.columns[placeholder='Model'][type='text']")
    (0, _mithril.default)(_constructUi.Input, {
      class: 'model-input',
      style: 'width:75%;max-width:300px;',
      placeholder: 'Model'
    })), (0, _mithril.default)("div.color", // m("input.color-input.twelve.columns[placeholder='Color'][type='text']")
    (0, _mithril.default)(_constructUi.Input, {
      class: 'color-input',
      style: 'width:75%;max-width:300px;',
      placeholder: 'Color'
    })), (0, _mithril.default)(".row.rower"), (0, _mithril.default)("div.row.buttons-group", [// GET AVB
    // m("Button.clear-button.button[type='button'][style='width:150px;margin:5px 10px;']",
    (0, _mithril.default)(_constructUi.Button, {
      iconLeft: _constructUi.Icons.DELETE,
      label: "Clear",
      onclick: function onclick() {
        document.querySelector('.model-input > input').value = '';
        document.querySelector('.color-input > input').value = '';
      }
    }), (0, _mithril.default)(_constructUi.Button, {
      iconLeft: _constructUi.Icons.SEARCH,
      label: 'Search',
      type: 'submit',
      loading: vnode.state.loading,
      onclick: function () {
        var _onclick2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
          var model, color;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  e.preventDefault();
                  SearchForm.clearResults();
                  vnode.state.loading = !vnode.state.loading;
                  model = document.querySelector('.model-input > input').value === '' ? 'm' : document.querySelector('.model-input > input').value;
                  color = document.querySelector('.color-input > input').value === '' ? 'c' : document.querySelector('.color-input > input').value; //

                  _context2.next = 7;
                  return _mithril.default.request({
                    method: "GET",
                    url: "/api/avb/".concat(model, "/").concat(color),
                    headers: {
                      smurf: localStorage.smurf
                    }
                  }).then(function (res) {
                    console.log(res);

                    if (res === 404) {
                      (0, _Nav.showToast)("Cant connect to websmart!", 'negative');
                    } else if (res === 401) {
                      (0, _Nav.showToast)('Search Again!'); // localStorage.clear()

                      _mithril.default.route.set('/login');
                    } else {
                      Home.results = Object.values(res);

                      if (Home.results.length === 0) {
                        (0, _Nav.showToast)('No results found!', 'negative');
                      }
                    }
                  });

                case 7:
                  vnode.state.loading = !vnode.state.loading;

                case 8:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function onclick(_x2) {
          return _onclick2.apply(this, arguments);
        }

        return onclick;
      }()
    })])]);
  }
};

function Sku() {
  return {
    oninit: function oninit(vnode) {
      vnode.state.loading = false;
      vnode.state.imgSrc = '';
      vnode.state.availability = [];
      vnode.state.imgFetched = false;
      vnode.state.discountedPrice = ''; // vnode.state.sku = vnode.attrs.sku

      vnode.state.getPrice = function (vnode) {
        if (!vnode.state.price && !localStorage["".concat(vnode.attrs.sku.year).concat(vnode.attrs.sku.season).concat(vnode.attrs.sku.model)]) {
          _mithril.default.request({
            method: "GET",
            url: "/api/price/".concat(vnode.attrs.sku.year, "/").concat(vnode.attrs.sku.season, "/").concat(vnode.attrs.sku.model),
            headers: {
              smurf: localStorage.smurf
            }
          }).then(function (res) {
            if (_noSaleAI.NOSALE.filter(function (e) {
              return e == vnode.attrs.sku.model + vnode.attrs.sku.color;
            }).length > 0 && vnode.attrs.sku.year + vnode.attrs.sku.season === '202') {
              vnode.dom.querySelector('.basic').textContent = 'BASICO';
            } else if (vnode.attrs.sku.year + vnode.attrs.sku.season === '202') {
              vnode.state.salable = true;
            }

            vnode.state.price = res;
            localStorage["".concat(vnode.attrs.sku.year).concat(vnode.attrs.sku.season).concat(vnode.attrs.sku.model)] = res;
          });
        }
      };
    },
    oncreate: function oncreate() {// vnode.state.imgSrc = ''
    },
    view: function view(vnode) {
      var i = vnode.attrs.i;
      var sku = vnode.attrs.sku;
      var string = sku.string.split(' ').join('');
      var discountedPrice = null;
      var content = (0, _mithril.default)("img.sku-image-".concat(i, "[src=").concat(vnode.state.imgSrc, "]"));
      return (0, _mithril.default)(_constructUi.Card, {
        class: "sku-wrapper",
        interactive: true,
        elevated: 2,
        fluid: true
      }, (0, _mithril.default)(".sku", (0, _mithril.default)(".sku-title.flex.row", // here will go skuString , svgButton and skuPrice
      (0, _mithril.default)('.string', sku.string), (0, _mithril.default)('.basic'), (0, _mithril.default)(_constructUi.Popover, {
        class: 'sku-picture',
        hasArrow: true,
        hasBackdrop: false,
        position: 'top',
        interactionType: 'click',
        content: content,
        trigger: (0, _mithril.default)(_constructUi.Button, {
          class: 'get-image',
          iconLeft: _constructUi.Icons.IMAGE,
          basic: true,
          size: 'xl',
          compact: true,
          loading: vnode.state.loading,
          onclick: function onclick() {
            if (!vnode.state.imgFetched) {
              vnode.state.loading = !vnode.state.loading; // e.preventDefault();
              // e.stopPropagation();

              fetch("api/image/".concat(sku.year, "/").concat(sku.season, "/").concat(sku.model), {
                headers: {
                  smurf: localStorage.smurf
                }
              }).then(function (res) {
                return res.text();
              }).then(function (url) {
                vnode.state.imgFetched = true;
                vnode.state.imgSrc = url;
                vnode.state.loading = !vnode.state.loading;

                _mithril.default.redraw();
              });
            }
          }
        })
      }))), (0, _mithril.default)('.row.labels-rows.flex.space-b', [// here go sku.desc and sizes
      (0, _mithril.default)(_constructUi.Button, {
        label: sku.descr,
        intent: 'warning',
        size: 'xs'
      }), (0, _mithril.default)(_constructUi.Button, {
        class: 'price-' + string,
        size: 'xs',
        intent: vnode.state.salable ? 'negative' : 'warning',
        oncreate: function oncreate(e) {
          vnode.state.getPrice(vnode);
          console.log(e);
        },
        sublabel: "\u20AC".concat(vnode.state.price || localStorage["".concat(sku.year).concat(sku.season).concat(sku.model)], " "),
        label: vnode.state.discountedPrice,
        loading: vnode.state.price || localStorage["".concat(sku.year).concat(sku.season).concat(sku.model)] ? false : true,
        onclick: function onclick() {
          if (vnode.state.salable) {
            vnode.state.discountedPrice = parseInt(parseInt(vnode.state.price) * 0.7);
            var sub = vnode.dom.querySelector('.cui-button-sublabel');
            sub.style.textDecoration = 'line-through';
          }
        }
      })]), // Size Buttons
      (0, _mithril.default)('.sizes-buttons', sku.sizes.map(function (item, i) {
        return (0, _mithril.default)(SizeButton, {
          sku: sku,
          i: i
        });
      })), (0, _mithril.default)('.sizes-wrapper', {}, sku.sizes.map(function (item, i) {
        var string = sku.string.split(' ').join('');
        return (0, _mithril.default)("ul.size-wrapper.size-".concat(i, "-").concat(string));
      })));
    }
  };
}

function SizeButton() {
  var shops = []; // let isOpen = false

  var isLoading = false;

  function getShops(sku, i) {
    _mithril.default.request({
      method: 'GET',
      url: "/api/".concat(sku.year, "/").concat(sku.season, "/").concat(sku.model, "/").concat(sku.color, "/").concat(sku.sizesForRequests[i]),
      headers: {
        smurf: localStorage.smurf
      }
    }).then(function (res) {
      shops = Object.values(res)[0];
      isLoading = !isLoading;
    });
  }

  return {
    view: function view(vnode) {
      var i = vnode.attrs.i;
      var sku = vnode.attrs.sku;
      var year = sku.year,
          season = sku.season,
          model = sku.model,
          color = sku.color,
          descr = sku.descr;
      var size = vnode.attrs.sku.sizes[i];
      var sizeForReq = vnode.attrs.sku.sizesForRequests[i];
      return [(0, _mithril.default)(_constructUi.Button, {
        label: size,
        style: 'margin: 0 2px;',
        loading: isLoading,
        intent: 'positive',
        size: 'xs',
        requestSize: sizeForReq,
        onclick: function () {
          var _onclick3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var string;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    isLoading = !isLoading;
                    _context3.next = 3;
                    return getShops(sku, i);

                  case 3:
                    string = sku.string.split(' ').join('');

                    _mithril.default.mount(document.querySelector("ul.size-".concat(i, "-").concat(string)), {
                      oninit: function oninit(vnode) {
                        vnode.state.intent = 'warning';
                      },
                      view: function view() {
                        var string = sku.string.split(' ').join('');

                        if (Object.keys(shops)[0]) {
                          return [(0, _mithril.default)(_constructUi.Tag, {
                            label: Object.keys(shops)[0],
                            intent: 'positive'
                          }), (0, _mithril.default)(_constructUi.Button, {
                            iconLeft: _constructUi.Icons.PLUS,
                            size: 'xs',
                            basic: true,
                            outline: true,
                            onclick: function onclick() {
                              // ADD SEARCH
                              var price = document.querySelector('.price-' + string).textContent.split('€')[1].split(',')[0].split('.').join('');
                              console.log(price);

                              _mithril.default.request({
                                method: "GET",
                                url: "/api/addSearch",
                                headers: {
                                  year: year,
                                  season: season,
                                  model: model,
                                  price: price,
                                  color: color,
                                  descr: descr,
                                  size: size,
                                  sizeForReq: sizeForReq
                                }
                              }).then(function (res) {
                                if (res._id) {
                                  console.log(res._id);
                                  (0, _Nav.showToast)("Added Search ".concat(sku.string, " ").concat(size, "!"), 'positive');

                                  _Searches.Searches.searchesList.splice(0, 0, res);
                                } else {
                                  (0, _Nav.showToast)("Couldn't add Search ".concat(sku.string, " ").concat(size, "!"), 'negative');
                                }
                              });
                            }
                          }), Object.values(shops)[0].map(function (item) {
                            if (item.search('NEGOZIO SOLOMEO') != -1) {
                              return (0, _mithril.default)('.list-item.solomeo', item);
                            } else {
                              return (0, _mithril.default)(".list-item", item);
                            }
                          })];
                        }
                      }
                    });

                  case 5:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          function onclick() {
            return _onclick3.apply(this, arguments);
          }

          return onclick;
        }()
      })];
    }
  };
} // let getReceivables = async () => {
//   let url = `/api/request/${sku.year}/${sku.season}/${sku.model}/${sku.color}`;
//   let res = await fetch(url).then(r => r.json());
//   if (res.total != "") {
//     let total = make("div", "label label-receivables", labelsWrapper)
//     total.textContent = res.total + ' da ricevere: ';
//     total.setAttribute('model', sku.model);
//     total.setAttribute('color', sku.color);
//
//     let receivableSizes = Object.keys(res.receivables);
//     let receivableQty = Object.values(res.receivables);
//     console.log(`${sku.year}/${sku.season}/${sku.model} ${receivableSizes.length} `);
//     receivableSizes.forEach((item, j) => {
//       total.innerHTML += `<div class="label label-size">${receivableQty[j]}/${item} </div>`
//        console.log(total.innerHTML);
//     });
//
//   }
// };
// getReceivables();
//   sku.sizes.forEach(item => {
//     let sizeElement = make('div', 'label label-size', labelsWrapper);
//     sizeElement.textContent = item
//   });
// });
// Router


_mithril.default.route(document.body, '/main', {
  '/main': {
    onmatch: function onmatch() {
      if (!localStorage.smurf) {
        _login.login.check();
      } else return Home;
    }
  },
  '/login': Login,
  '/orders': ordersSection,
  '/clients': clientsSection,
  '/history': historySection,
  // '/dhlTracking': Dhl,
  '/orders/edit/:id': _EditOrder.default,
  '/clients/edit/:id': _EditClient.default,
  '/richieste': _Richieste.Richieste
});
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","mithril":"../node_modules/mithril/index.js","socket.io-client":"../node_modules/socket.io-client/build/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js","../node_modules/construct-ui/lib/index.css":"../node_modules/construct-ui/lib/index.css","./logo.svg":"logo.svg","/components/login":"components/login.js","/components/Tabs":"components/Tabs.js","/components/Nav":"components/Nav.js","/components/EditClient":"components/EditClient.js","/components/Searches":"components/Searches.js","/components/Richieste":"components/Richieste.js","/components/EditOrder":"components/EditOrder.js","./noSaleAI20":"noSaleAI20.js"}],"../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33139" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map