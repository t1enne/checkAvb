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

},{"./hyperscript":"../node_modules/mithril/hyperscript.js","./request":"../node_modules/mithril/request.js","./mount-redraw":"../node_modules/mithril/mount-redraw.js","./route":"../node_modules/mithril/route.js","./render":"../node_modules/mithril/render.js","./querystring/parse":"../node_modules/mithril/querystring/parse.js","./querystring/build":"../node_modules/mithril/querystring/build.js","./pathname/parse":"../node_modules/mithril/pathname/parse.js","./pathname/build":"../node_modules/mithril/pathname/build.js","./render/vnode":"../node_modules/mithril/render/vnode.js","./promise/polyfill":"../node_modules/mithril/promise/polyfill.js"}],"../node_modules/construct-ui/lib/esm/_shared/align.js":[function(require,module,exports) {
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
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/support/isBufferBrowser.js":[function(require,module,exports) {
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
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

},{}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

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
},{}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/util.js":[function(require,module,exports) {
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
},{"./support/isBuffer":"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/support/isBufferBrowser.js","inherits":"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/node_modules/inherits/inherits_browser.js","process":"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../node_modules/construct-ui/lib/esm/components/list/ListItem.js":[function(require,module,exports) {
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
},{"tslib":"../node_modules/tslib/tslib.es6.js","mithril":"../node_modules/mithril/index.js","classnames":"../node_modules/classnames/index.js","../../_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","util":"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/util.js"}],"../node_modules/construct-ui/lib/esm/components/list/index.js":[function(require,module,exports) {
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
},{"./_shared":"../node_modules/construct-ui/lib/esm/_shared/index.js","./components":"../node_modules/construct-ui/lib/esm/components/index.js","./utils":"../node_modules/construct-ui/lib/esm/utils/index.js"}],"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
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
},{}],"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
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
},{"./bundle-url":"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../node_modules/construct-ui/lib/index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Tabs.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _constructUi = require("construct-ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var seaching = false,
    session;
var AppToaster = new _constructUi.Toaster();
var Clients = {
  clientsList: [],
  loadClients: function loadClients() {
    _mithril.default.request({
      method: "GET",
      url: "/api/listClients"
    }).then(function (res) {
      return Clients.clientsList = res;
    });
  },
  oninit: function oninit() {
    if (Clients.clientsList.length === 0) {
      Clients.loadClients();
    }
  },
  view: function view() {
    return Clients.clientsList.map(function (client) {
      return (0, _mithril.default)(_constructUi.Card, {
        class: 'client-card',
        url: client._id,
        elevated: 2,
        interactive: true,
        fluid: true
      }, (0, _mithril.default)("h1#client-name", client.name + ' ' + client.surname), (0, _mithril.default)(_constructUi.Button, {
        class: 'mail-copy-button',
        label: "mail: ".concat(client.mail),
        iconLeft: _constructUi.Icons.COPY,
        basic: true,
        onclick: function onclick(e) {
          navigator.clipboard.writeText(client.mail);
        }
      }), (0, _mithril.default)(_constructUi.Button, {
        class: 'phone-copy-button',
        label: "phone: ".concat(client.phone ? client.phone : '', " "),
        iconLeft: _constructUi.Icons.COPY,
        basic: true,
        onclick: function onclick(e) {
          navigator.clipboard.writeText(client.phone);
        }
      }));
    });
  }
};
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
                console.log(res);
                Searches.searchesList = res;
                Searches.filterSearches(res);
                console.log(Searches.assignedSearches);
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
      Searches.loadSearches();
    }
  },
  view: function view() {
    return (0, _mithril.default)(_constructUi.List, {
      interactive: true,
      size: 'md',
      class: 'flex reverse',
      style: 'max-height:none;'
    }, Searches.searchesList.map(function (item) {
      return (0, _mithril.default)(_constructUi.ListItem, {
        label: "".concat(item.year).concat(item.season, " ").concat(item.model, " ").concat(item.color, " ").concat(item.size),
        contentRight: (0, _mithril.default)(_constructUi.Tag, {
          label: '€' + item.price + ',00',
          intent: 'warning'
        })
      });
    }));
  }
};

function AssignedSearch() {
  return {
    view: function view(vnode) {
      var item = vnode.attrs.search;
      var contentR = (0, _mithril.default)(_constructUi.Button, {
        iconLeft: _constructUi.Icons.MINUS,
        intent: 'negative',
        size: 'xs',
        basic: true,
        onclick: function onclick(e) {
          //UNASSIGN SEARCH
          e.preventDefault();
          e.stopPropagation();
          console.log(1);

          _mithril.default.request({
            method: 'GET',
            url: "/api/addToClient/unassigned/".concat(item._id)
          }).then(function (res) {
            console.log(res);
          });
        }
      });
      return (0, _mithril.default)(_constructUi.ListItem, {
        label: "".concat(item.year).concat(item.season, " ").concat(item.model, " ").concat(item.color, " ").concat(item.size),
        // label: 'text',
        contentLeft: contentR,
        contentRight: (0, _mithril.default)(_constructUi.Tag, {
          intent: 'warning',
          size: 'xs',
          label: item.price
        })
      });
    }
  };
}

function UnassignedSearch() {
  return {
    view: function view(vnode) {
      var item = vnode.attrs.item;
      var contentR = (0, _mithril.default)(_constructUi.Tag, {
        label: item.price,
        intent: 'warning'
      }); // let contentL =

      return (0, _mithril.default)(_constructUi.ListItem, {
        label: "".concat(item.year).concat(item.season, " ").concat(item.model, " ").concat(item.color, " ").concat(item.size),
        contentRight: contentR,
        contentLeft: (0, _mithril.default)(_constructUi.Button, {
          iconLeft: _constructUi.Icons.PLUS,
          intent: 'positive',
          size: 'xs',
          label: 'Add',
          basic: true,
          onclick: function onclick(e) {
            // ASSIGN SEARCH
            var searchId = item._id;
            var orderId = document.querySelector('.selected-order').getAttribute('id');
            console.log('search id is ' + searchId);
            console.log('order id is ' + orderId);

            _mithril.default.request({
              method: 'GET',
              url: "/api/addToClient/".concat(orderId, "/").concat(searchId)
            }).then(function (res) {
              console.log(res);
            });
          }
        })
      });
    }
  };
} // GET ORDERS


var Orders = {
  ordersList: [],
  loadOrders: function loadOrders() {
    _mithril.default.request({
      method: "GET",
      url: "/api/listOrders"
    }).then(function (res) {
      console.log(res);
      Orders.ordersList = res;
    });
  },
  oninit: function oninit(vnode) {
    if (Orders.ordersList.length === 0) {
      Orders.loadOrders();
      Searches.loadSearches();
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
      var order = vnode.attrs.order;
      var o = vnode.attrs.o;
      return (0, _mithril.default)(_constructUi.Card, {
        class: "order client-order collapsible",
        id: order._id,
        clientId: order.clientId,
        interactive: true,
        fluid: true,
        elevation: 2 // SELECT ORDER

      }, (0, _mithril.default)(_constructUi.PopoverMenu, {
        closeOnContentClick: true,
        content: [(0, _mithril.default)(_constructUi.Button, {
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
              console.log(res);
              Orders.ordersList.splice(Orders.ordersList.indexOf(res), 1);
            });
          }
        })],
        trigger: (0, _mithril.default)(_constructUi.Button, {
          iconLeft: _constructUi.Icons.SETTINGS,
          style: 'float:right;'
        })
      }), [(0, _mithril.default)(".order-client-name[id=".concat(order.clientId, "]"), {
        onclick: function onclick() {
          // controller for the selected order
          vnode.state.selected = !vnode.state.selected;
          var thisOrder = document.getElementById("".concat(order._id));

          if (vnode.state.selected) {
            classy('.client-order', 'selected-order', 'remove');
            thisOrder.classList.toggle('selected-order');
            classy('.client-order', 'd-none', 'add');
            thisOrder.classList.toggle('d-none');
          } else {
            // thisOrder.classList.toggle('selected-order')
            classy('.client-order', 'selected-order', 'remove');
            classy('.client-order', 'd-none', 'remove');
          }
        }
      }, (0, _mithril.default)("h1", order.clientName)), (0, _mithril.default)(_constructUi.Tag, {
        label: order.date,
        class: 'date'
      }), (0, _mithril.default)(_constructUi.Tag, {
        label: order.user,
        intent: 'primary',
        class: 'user'
      }) //, m(Tag, {
      //   label: order._id,
      //   class: 'url',
      //   size: 'xs',
      //   url: order._id
      // })
      ], [(0, _mithril.default)(_constructUi.List, {
        size: 'xs',
        style: "margin-top:1rem;",
        class: 'collapsible assigned-orders'
      }, Searches.assignedSearches[order._id] ? Searches.assignedSearches[order._id].map(function (search) {
        vnode.state.pieces++;
        vnode.state.total += parseInt(search.price);
        return (0, _mithril.default)(AssignedSearch, {
          search: search
        });
      }) : undefined), (0, _mithril.default)('.row.searches-totals', (0, _mithril.default)(_constructUi.Tag, {
        label: "total pcs: ".concat(vnode.state.pieces)
      }), (0, _mithril.default)(_constructUi.Tag, {
        label: "total: \u20AC".concat(vnode.state.total),
        intent: 'warning'
      })), (0, _mithril.default)(_constructUi.Button, {
        fluid: true,
        size: 'md',
        style: 'margin: auto; display: block; padding: 0; transition: rotate .3s',
        iconLeft: _constructUi.Icons.CHEVRON_DOWN,
        basic: true,
        onclick: function onclick(e) {
          e.preventDefault();
          e.stopPropagation();
          var list = vnode.dom.querySelector('.assigned-orders');
          list.classList.toggle('collapsed');
          console.log(vnode);
          var svg = e.target.children[0];

          _mithril.default.redraw();
        }
      })]);
    }
  },
  view: function view(vnode) {
    var array;

    if (Searches.unassignedSearches.length != 0) {
      array = Searches.unassignedSearches.map(function (item) {
        return (0, _mithril.default)(UnassignedSearch, {
          item: item
        });
      });
    }

    return [(0, _mithril.default)('.orders.flex.reverse', Orders.ordersList.map(function (order, o) {
      return (0, _mithril.default)(Orders.order, {
        order: order,
        o: o
      });
    })), (0, _mithril.default)('h1', 'Unassigned Searches'), (0, _mithril.default)(_constructUi.Card, {
      fluid: true
    }, (0, _mithril.default)(_constructUi.List, {
      class: 'unassigned-searches',
      interactive: false,
      size: 'xs'
    }, (0, _mithril.default)('.list-items-wrapper', array)))];
  }
};
var Tabs = {
  oninit: function () {
    var _oninit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return fetch('/logged').then(function (res) {
                return res.json();
              });

            case 2:
              session = _context2.sent;

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function oninit() {
      return _oninit.apply(this, arguments);
    }

    return oninit;
  }(),
  ordersSection: {
    view: function view(vnode) {
      return [(0, _mithril.default)("h1", "Your Orders"), (0, _mithril.default)(_constructUi.Button, {
        basic: true,
        iconLeft: _constructUi.Icons.REFRESH_CW,
        style: 'float: right;',
        // loading: vnode.tag.loading,
        onclick: function () {
          var _onclick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return Orders.loadOrders();

                  case 2:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
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
              if (Clients.clientsList.length === 0) {
                Clients.loadClients();
              }
            },
            view: function view() {
              return (0, _mithril.default)('.order-div', [// CREATE ORDER
              (0, _mithril.default)(_constructUi.SelectList, {
                items: Clients.clientsList,
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
                    url: "/api/createOrder/".concat(item._id, "/").concat(session.user, "/").concat(item.name, "&").concat(item.surname)
                  }).then(function (res) {
                    console.log(res);
                    Orders.ordersList.push(res); //m.mount(document.querySelector('.order-list'), Orders)
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
      })]), (0, _mithril.default)('.new-order'), (0, _mithril.default)(".search-results"), (0, _mithril.default)(".order-list", {
        oncreate: function oncreate(vnode) {
          _mithril.default.mount(vnode.dom, Orders);
        }
      }, 'Order List')])];
    }
  },
  clientsSection: {
    loading: false,
    view: function view(vnode) {
      return [(0, _mithril.default)("h1", "Client List"), (0, _mithril.default)(_constructUi.Button, {
        basic: true,
        iconLeft: _constructUi.Icons.REFRESH_CW,
        style: 'float: right;',
        loading: vnode.state.loading,
        onclick: function () {
          var _onclick2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    vnode.state.loading = !vnode.state.loading;
                    _context4.next = 3;
                    return Clients.loadClients();

                  case 3:
                    vnode.state.loading = !vnode.state.loading;

                  case 4:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4);
          }));

          function onclick() {
            return _onclick2.apply(this, arguments);
          }

          return onclick;
        }()
      }), (0, _mithril.default)(".client-content", [(0, _mithril.default)(".new-client.row", [(0, _mithril.default)(_constructUi.Button, {
        onclick: function onclick(e) {
          document.querySelector('.new-client.row').classList.toggle('reveal-inputs');
        },
        label: "New Client",
        iconLeft: _constructUi.Icons.PLUS
      }), (0, _mithril.default)(_constructUi.ControlGroup, {
        class: 'new-client-inputs'
      }, [(0, _mithril.default)(_constructUi.Input, {
        type: 'text',
        name: 'client-name',
        placeholder: 'Name'
      }), (0, _mithril.default)(_constructUi.Input, {
        type: 'text',
        name: 'client-surname',
        placeholder: 'Surname'
      }), (0, _mithril.default)(_constructUi.Input, {
        type: 'text',
        name: 'client-mail',
        placeholder: 'email'
      }), (0, _mithril.default)(_constructUi.Input, {
        type: 'text',
        name: 'client-phone',
        placeholder: 'Telephone'
      }), (0, _mithril.default)(_constructUi.Button, {
        type: 'submit',
        label: "Add Client",
        // CREATE NEW CLIENT
        onclick: function () {
          var _onclick3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var name, surname, mail, phone, username, provider, tail;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    name = document.querySelector('input[name="client-name"]').value.trim();
                    surname = document.querySelector('input[name="client-surname"]').value.trim();
                    mail = document.querySelector('input[name="client-mail"]').value.trim();
                    phone = document.querySelector('input[name="client-phone"]').value.trim();
                    username = mail.split('@')[0];
                    provider = mail.split('@')[1].split('.')[0];
                    tail = mail.split('@')[1].split('.')[1];
                    _context5.next = 9;
                    return _mithril.default.request({
                      method: "GET",
                      url: "/api/newClient/".concat(name, "/").concat(surname, "/").concat(username, "/").concat(provider, "/").concat(tail, "/").concat(phone)
                    });

                  case 9:
                    // emit a click event for convenience on the clients radio to fetch the clients
                    document.querySelector('#radio2').click();

                  case 10:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5);
          }));

          function onclick() {
            return _onclick3.apply(this, arguments);
          }

          return onclick;
        }()
      })])]), (0, _mithril.default)("ul.client-list", (0, _mithril.default)(Clients))])];
    }
  },
  historySection: {
    historyList: [],
    view: function view() {
      return [(0, _mithril.default)("h1", "A History of your Searches"), (0, _mithril.default)(_constructUi.Button, {
        basic: true,
        iconLeft: _constructUi.Icons.REFRESH_CW,
        style: 'float: right;',
        // loading: vnode.tag.loading,
        onclick: function () {
          var _onclick4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return Searches.loadSearches();

                  case 2:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6);
          }));

          function onclick() {
            return _onclick4.apply(this, arguments);
          }

          return onclick;
        }()
      }), (0, _mithril.default)(Searches)];
    }
  },
  view: function view() {
    return [(0, _mithril.default)('.user-icons.flex.f-width', {
      style: 'justify-content:space-between;'
    }, (0, _mithril.default)(_constructUi.Button, {
      iconLeft: _constructUi.Icons.USER,
      size: 'xl',
      basic: true,
      onclick: function onclick() {
        classy('.user-panel', 'hidden', 'toggle');
      }
    }), (0, _mithril.default)('.login-user'), (0, _mithril.default)(_constructUi.Button, {
      iconLeft: _constructUi.Icons.X,
      size: 'xl',
      basic: true,
      onclick: function onclick() {
        classy('.user-panel', 'hidden', 'toggle');
      }
    })), (0, _mithril.default)("input[id='radio1'][type='radio'][name='css-tabs']", {
      onclick: function onclick() {
        _mithril.default.mount(document.querySelector('#content1'), Tabs.ordersSection);
      }
    }), (0, _mithril.default)("input[id='radio2'][type='radio'][name='css-tabs']", {
      onclick: function onclick(e) {
        _mithril.default.mount(document.querySelector('#content2'), Tabs.clientsSection);
      }
    }), (0, _mithril.default)("input[id='radio3'][type='radio'][name='css-tabs']", {
      onclick: function onclick(e) {
        _mithril.default.mount(document.querySelector('#content3'), Tabs.historySection);
      }
    }), (0, _mithril.default)("[id='tabs']", [(0, _mithril.default)("label.tab-orders[id='tab1 tab-orders'][for='radio1']", "Orders"), (0, _mithril.default)("label.tab-clients[id='tab2 tab-clients'][for='radio2']", "Clients"), (0, _mithril.default)("label.tab-history[id='tab3 tab-history'][for='radio3']", "History")]), (0, _mithril.default)("[id='content']", [(0, _mithril.default)("section[id='content1']"), (0, _mithril.default)("section[id='content2']"), (0, _mithril.default)("section[id='content3']") // m(Tabs.ordersSection),
    // m(Tabs.clientsSection),
    // m(Tabs.historySection)
    ])];
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

module.exports = Tabs;
},{"mithril":"../node_modules/mithril/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js"}],"app.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _mithril = _interopRequireDefault(require("mithril"));

var _constructUi = require("construct-ui");

require("../node_modules/construct-ui/lib/index.css");

var _Tabs = _interopRequireDefault(require("/components/Tabs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_constructUi.FocusManager.alwaysShowFocus();

var resultsElement = document.querySelector('.results');
var loader = document.querySelector('.loader');
var AppToaster = new _constructUi.Toaster(); // Loader SVG

_mithril.default.mount(loader, {
  view: function view() {
    return (0, _mithril.default)("svg[version='1.1'][id='L9'][xmlns='http://www.w3.org/2000/svg'][xmlns:xlink='http://www.w3.org/1999/xlink'][x='0px'][y='0px'][viewBox='0 0 100 100'][enable-background='new 0 0 0 0'][xml:space='preserve']", (0, _mithril.default)("path[fill='black'][d='M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50']", (0, _mithril.default)("animateTransform[attributeName='transform'][attributeType='XML'][type='rotate'][dur='1s'][from='0 50 50'][to='360 50 50'][repeatCount='indefinite']")));
  }
});

var session;

function show(msg) {
  AppToaster.show({
    message: msg,
    icon: _constructUi.Icons.BELL,
    intent: 'positive'
  });
}

var Login = {
  view: function view() {
    return [(0, _mithril.default)('.logo-bg', {
      style: 'width: auto; height: 100px; background: url("/logo.86ce68ea.svg") no-repeat center;'
    }), (0, _mithril.default)(_constructUi.Input, {
      style: 'display:block;margin:5px auto;',
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.USER
      }),
      placeholder: 'Your ASWEB Username',
      autocomplete: 'username'
    }), (0, _mithril.default)(_constructUi.Input, {
      style: 'display:block;margin:5px auto;',
      contentLeft: (0, _mithril.default)(_constructUi.Icon, {
        name: _constructUi.Icons.LOCK
      }),
      placeholder: 'Password',
      type: 'password',
      autocomplete: "current-password"
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
                  e.preventDefault();

                  if (session.user) {
                    _context.next = 5;
                    break;
                  }

                  _context.next = 4;
                  return getCookie();

                case 4:
                  show('Logged in!');

                case 5:
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
    }), (0, _mithril.default)(AppToaster, {
      clearOnEscapeKey: true,
      position: 'top'
    })];
  }
}; //check if session exists

function loginCheck() {
  return _loginCheck.apply(this, arguments);
}

function _loginCheck() {
  _loginCheck = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return fetch('/logged').then(function (res) {
              return res.json();
            });

          case 3:
            session = _context5.sent;

            if (session.smurf && session.user) {
              classy('form.login', 'd-none', 'add');
              classy('.user-personal-bucket', 'd-none', 'remove');

              if (!document.querySelector('.user-panel').classList.contains('hidden')) {
                classy('.user-panel', 'hidden', 'add');
              }

              console.log(session);
              document.querySelectorAll('.login-user').forEach(function (item) {
                item.textContent = session.user;
              });
            } else {
              classy('.user-panel', 'hidden', 'remove');
              classy('form.login', 'd-none', 'remove');
            }

            _context5.next = 10;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0.message);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return _loginCheck.apply(this, arguments);
}

loginCheck();

_mithril.default.mount(document.querySelector('form.login'), Login);

function getCookie() {
  return _getCookie.apply(this, arguments);
} // userIcons


function _getCookie() {
  _getCookie = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var user, pwd;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            // let user = document.querySelector('form.login > div.cui-input:nth-child(2) > input:nth-child(2)').value
            // let pwd = document.querySelector('form.login div.cui-input:nth-child(3) > input:nth-child(2)').value
            user = 'ntaov';
            pwd = 'ntaov456';
            _context6.next = 4;
            return fetch("api/login/".concat(user, "/").concat(pwd)).then(function (res) {
              return res.json();
            }).then(function (json) {
              return console.log(json);
            });

          case 4:
            user = '';
            pwd = '';
            loginCheck();

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _getCookie.apply(this, arguments);
}

_mithril.default.mount(document.querySelector('.user-panel-dropdown'), {
  view: function view() {
    return [(0, _mithril.default)('.user-icons', {
      onclick: function onclick() {
        classy('.user-panel', 'hidden', 'toggle');
        document.querySelector('#radio1').click();
      }
    }, (0, _mithril.default)(_constructUi.Icon, {
      name: _constructUi.Icons.CHEVRON_DOWN,
      size: 'xl'
    }), (0, _mithril.default)(_constructUi.Icon, {
      name: _constructUi.Icons.USER,
      size: 'xl'
    }), (0, _mithril.default)('.login-user'))];
  }
});

_mithril.default.mount(document.querySelector('.user-personal-bucket'), _Tabs.default);

var resultsArray;
var SearchForm = {
  loading: false,
  clearFields: function clearFields() {
    resultsArray = [];
  },
  view: function view(vnode) {
    return (0, _mithril.default)("form", [(0, _mithril.default)("div.model", //m("input.model-input.twelve.columns[placeholder='Model'][type='text']")
    (0, _mithril.default)(_constructUi.Input, {
      class: 'model-input',
      placeholder: 'Model'
    })), (0, _mithril.default)("div.color", // m("input.color-input.twelve.columns[placeholder='Color'][type='text']")
    (0, _mithril.default)(_constructUi.Input, {
      class: 'color-input',
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
                  vnode.state.loading = !vnode.state.loading;

                  if (!session.user) {
                    _context2.next = 11;
                    break;
                  }

                  model = document.querySelector('.model-input > input').value === '' ? 'm' : document.querySelector('.model-input > input').value;
                  color = document.querySelector('.color-input > input').value === '' ? 'c' : document.querySelector('.color-input > input').value; //

                  SearchForm.clearFields();
                  _context2.next = 8;
                  return _mithril.default.request({
                    method: "GET",
                    url: "/api/avb/".concat(model, "/").concat(color)
                  }).then(function (res) {
                    resultsArray = Object.values(res);
                  });

                case 8:
                  vnode.state.loading = !vnode.state.loading;
                  _context2.next = 12;
                  break;

                case 11:
                  document.querySelector('.nav .user-icon').click();

                case 12:
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

_mithril.default.mount(document.querySelector('.search-form'), SearchForm);

_mithril.default.mount(document.querySelector('.results'), {
  loading: false,
  view: function view(vnode) {
    if (resultsArray) {
      return (0, _mithril.default)('.res-wrap', resultsArray.map(function (item, i) {
        return (0, _mithril.default)('.sku-wrapper-key', {
          key: item.id
        }, (0, _mithril.default)(Sku, {
          sku: item,
          i: i
        }));
      }));
    }
  }
});

function Sku() {
  return {
    oninit: function oninit(vnode) {
      vnode.state.loading = false;
      vnode.state.imgSrc = '';
      vnode.state.availability = [];
      vnode.state.imgFetched = false; // vnode.state.price = '--,--'
      // vnode.state.sku = vnode.attrs.sku

      vnode.state.getPrice = function () {
        _mithril.default.request({
          method: 'GET',
          url: "/api/price/".concat(vnode.attrs.sku.year, "/").concat(vnode.attrs.sku.season, "/").concat(vnode.attrs.sku.model)
        }).then(function (res) {
          vnode.state.price = res;
        });
      };
    },
    oncreate: function oncreate(vnode) {// vnode.state.imgSrc = ''
    },
    view: function view(vnode) {
      var _m;

      var i = vnode.attrs.i;
      var sku = vnode.attrs.sku;
      var string = sku.string.split(' ').join('');
      sku.price = '';
      var content = (0, _mithril.default)("img.sku-image-".concat(i, "[src=").concat(vnode.state.imgSrc, "]"));
      return (0, _mithril.default)(_constructUi.Card, {
        class: "sku-wrapper",
        interactive: true,
        elevated: 2,
        fluid: true
      }, (0, _mithril.default)(".sku", (0, _mithril.default)(".sku-title.flex.row", {
        style: 'margin:10px'
      }, // here will go skuString , svgButton and skuPrice
      (0, _mithril.default)('.string', sku.string), (0, _mithril.default)(_constructUi.Popover, (_m = {
        class: 'sku-picture',
        hasArrow: true,
        hasBackdrop: false,
        position: 'top',
        interactionType: 'click'
      }, _defineProperty(_m, "hasBackdrop", false), _defineProperty(_m, "content", content), _defineProperty(_m, "trigger", (0, _mithril.default)(_constructUi.Button, {
        class: 'get-image',
        iconLeft: _constructUi.Icons.IMAGE,
        basic: true,
        size: 'xl',
        loading: vnode.state.loading,
        onclick: function onclick(e) {
          if (!vnode.state.imgFetched) {
            vnode.state.loading = !vnode.state.loading; // e.preventDefault();
            // e.stopPropagation();

            fetch("api/image/".concat(sku.year, "/").concat(sku.season, "/").concat(sku.model)).then(function (res) {
              return res.text();
            }).then(function (url) {
              vnode.state.imgFetched = true;
              vnode.state.imgSrc = url;
              vnode.state.loading = !vnode.state.loading;

              _mithril.default.redraw();
            });
          }
        }
      })), _m)), // m(PriceLabel, {
      //   sku: sku,
      //   price: vnode.state.price
      // })
      (0, _mithril.default)(_constructUi.Tag, {
        class: 'price-' + string,
        intent: 'warning',
        oninit: function oninit() {
          if (!vnode.state.price) {
            _mithril.default.request({
              method: "GET",
              url: "/api/price/".concat(sku.year, "/").concat(sku.season, "/").concat(sku.model)
            }).then(function (res) {
              vnode.state.price = res;
            });
          }
        },
        label: vnode.state.price
      }))), (0, _mithril.default)('.row[style="display: block;"]', [// here go sku.desc and sizes
      (0, _mithril.default)(_constructUi.Tag, {
        label: sku.descr,
        intent: 'warning',
        size: 'xs'
      }), // Size Buttons
      sku.sizes.map(function (item, i) {
        return (0, _mithril.default)(SizeButton, {
          sku: sku,
          i: i
        });
      }), (0, _mithril.default)('.sizes-wrapper', {}, sku.sizes.map(function (item, i) {
        var string = sku.string.split(' ').join('');
        return (0, _mithril.default)("ul.size-wrapper.size-".concat(i, "-").concat(string));
      }))]));
    }
  };
}

function SizeButton() {
  var shops = [];
  var isOpen = false;
  var isLoading = false;

  function getShops(sku, i) {
    _mithril.default.request({
      method: 'GET',
      url: "/api/".concat(sku.year, "/").concat(sku.season, "/").concat(sku.model, "/").concat(sku.color, "/").concat(sku.sizesForRequests[i])
    }).then(function (res) {
      shops = Object.values(res)[0];
      isLoading = !isLoading; // m.redraw()
      // console.log(shops);
    });
  }

  return {
    // oninit(vnode) {
    //   vnode.state.loading = false
    // },
    view: function view(vnode) {
      var i = vnode.attrs.i;
      var sku = vnode.attrs.sku;
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
          var _onclick3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(e) {
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
                        vnode.state.label = 'Add';
                      },
                      view: function view() {
                        var string = sku.string.split(' ').join('');
                        return [(0, _mithril.default)(_constructUi.Tag, {
                          label: Object.keys(shops)[0],
                          intent: 'positive'
                        }), (0, _mithril.default)(_constructUi.Button, {
                          iconLeft: _constructUi.Icons.PLUS,
                          size: 'xs',
                          intent: vnode.state.intent,
                          label: vnode.state.label,
                          basic: true,
                          outline: true,
                          onclick: function onclick() {
                            // ADD SEARCH
                            var price = document.querySelector('.price-' + string).textContent.split(',')[0].split('.').join('');
                            console.log(price);

                            _mithril.default.request({
                              method: "GET",
                              url: "/api/addSearch/".concat(session.user, "/").concat(sku.year, "/").concat(sku.season, "/").concat(sku.model, "/").concat(sku.color, "/").concat(size, "/").concat(sizeForReq, "/").concat(price)
                            }).then(function (res) {
                              if (res._id) {
                                console.log(res._id);
                                vnode.state.intent = 'positive';
                                vnode.state.label = 'Added!';
                              } else {
                                vnode.state.label = 'Error!';
                                vnode.state.intent = 'negative';
                              }
                            });
                          }
                        }), Object.values(shops)[0] ? Object.values(shops)[0].map(function (item) {
                          if (item.search('NEGOZIO SOLOMEO') != -1) {
                            return (0, _mithril.default)('.list-item.solomeo', item);
                          } else {
                            return (0, _mithril.default)(".list-item", item);
                          }
                        }) : null];
                      }
                    });

                  case 5:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          function onclick(_x3) {
            return _onclick3.apply(this, arguments);
          }

          return onclick;
        }()
      })];
    }
  };
} // getShops


var displayShops = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var shopsPromises, y, shopsObject, res;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            skuElement = document.querySelector(".sku-".concat(i));

            if (skuElement.classList.contains('fetched')) {
              _context4.next = 18;
              break;
            }

            classy(skuElement, 'fetched', 'add'); // array for promises

            shopsPromises = [];
            y = 0;

          case 5:
            if (!(y < sku.sizesForRequests.length)) {
              _context4.next = 15;
              break;
            }

            shopsObject = fetch("/api/".concat(sku.year, "/").concat(sku.season, "/").concat(sku.model, "/").concat(sku.color, "/").concat(sku.sizesForRequests[y])).then(function (res) {
              return res.json();
            });
            _context4.t0 = shopsPromises;
            _context4.next = 10;
            return shopsObject;

          case 10:
            _context4.t1 = _context4.sent;

            _context4.t0.push.call(_context4.t0, _context4.t1);

          case 12:
            y++;
            _context4.next = 5;
            break;

          case 15:
            res = [];
            _context4.next = 18;
            return Promise.all(shopsPromises).then(function (shops) {
              res = shops;
              return res;
            });

          case 18:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function displayShops() {
    return _ref.apply(this, arguments);
  };
}(); // document.querySelector(`.sizes-wrapper-${i}`).addEventListener('click', async (event) => {
//    FETCH SHOPS if not already fetched
//   if (!skuElement.classList.contains('fetched')) {
//     classy(skuElement, 'fetched', 'add');
//      array for promises
//     let shopsPromises = [];
//
//     for (var y = 0; y < sku.sizesForRequests.length; y++) {
//       let shopsObject = fetch(`/api/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${sku.sizesForRequests[y]}`).then(res => res.json());
//       shopsPromises.push(await shopsObject);
//     }
//
//     let res = [];
//
//     await Promise.all(shopsPromises).then(shops => {
//       res = shops;
//     });
//
//      print out the shops
//
//     res.forEach((item, z) => {
//       let index = Object.keys(item)[0];
//
//       let size = Object.keys(item[index])
//       console.log(sku);
//
//       let sizeLabelElement = make('li', `size-${z}`, sizesWrapper)
//       let sizeRow = maker("div", {
//         class: "size size-row flex"
//       }, sizeLabelElement)
//       let sizeLabel = maker("label", {
//         class: "label label-size",
//         size: sku.sizesForRequests[z],
//          click to add to orders
//         on: [
//           "click", async () => {
//             if (toAddPopup.classList.contains('add')) {
//               toAddPopup.classList.remove('add')
//             } else
//               toAddPopup.classList.add('add');
//             }
//           ],
//         text: size
//       }, sizeRow);
//
//       let toAddPopup = maker("span", {
//         class: "label to-add-popout",
//         text: "Add to orders",
//         on: [
//           "click", () => {
//             let price = priceElement.textContent.slice(1);
//             fetch(`/api/addSearch/${session.user}/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${size}/${sku.sizesForRequests[z]}/price`).then(res => res.json()).then(json => console.log(json))
//             toAddPopup.classList.remove('add')
//
//           }
//         ]
//       }, sizeRow);
//
//       let sizeList = make('ul', 'size=list', sizeLabelElement)
//
//       let shops = Object.values(item[index])[0]
//       shops.forEach(item => {
//         let shop = make('li', 'shop', sizeList)
//         if (item == 'NEGOZIO SOLOMEO') {
//           shop.classList.add('negsol')
//         }
//         shop.textContent = item
//       });
//
//     });
//     dotLoader.classList.add('hidden')
//      sizeswrapper set maxHeight for the first time
//     sizesWrapper.style.maxHeight = sizesWrapper.scrollHeight + 'px';
//   }
// });
//
//
// let getReceivables = async () => {
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
// document.querySelectorAll('.total-receivables').forEach((item) => {
//   item.addEventListener('click', async (event) => {
//     let model = event.target.getAttribute('model')
//     let color = event.target.getAttribute('color')
//     let rnd = event.target.getAttribute('rnd')
//     let receivables = await fetch(`api/toReceive/${model}/${color}/${rnd}`).then(res => res.json());
//     console.log(receivables);
//     if (receivables) {
//       item.textContent = ''
//       Object.keys(receivables).forEach(s => {
//         let size = s;
//         let qty = Object.values(receivables[s])
//         item.textContent += `${qty}/${size} `
//       });
//     }
//   }, true);
// });


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
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","mithril":"../node_modules/mithril/index.js","construct-ui":"../node_modules/construct-ui/lib/esm/index.js","../node_modules/construct-ui/lib/index.css":"../node_modules/construct-ui/lib/index.css","/components/Tabs":"components/Tabs.js"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "4310" + '/');

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
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map