#!/bin/bash
PYTHON_BIN="python"
JVM_ARCH="-d64"

CLOSURE_BUILD_DIR="www/js-closure/closure/bin/build"
CLOSURE_UTIL_DIR="bin/closure"

JS_APP_DIR="www/js"
JS_APP_INPUT="www/js/app.js"
JS_APP_COMPILLED="www/js/app-compiled.js"
JS_APP_DEPS="www/js/app-deps.js"
JS_CLOSURE_LIB_DIR="www/js-closure/closure/goog"
JS_CLOSURE_THIRD_PARTY_DIR="www/js-closure/third_party/closure/goog"

TEMPLATE_DIR="www/js"
URL_APP="../../../../www/js"

LOCALE="cs_CZ"

compile() {
	${PYTHON_BIN} ${CLOSURE_BUILD_DIR}/closurebuilder.py \
		--root=${JS_APP_DIR} \
		--root=${JS_CLOSURE_LIB_DIR} \
		--root=${JS_CLOSURE_THIRD_PARTY_DIR} \
		--input=${JS_APP_INPUT} \
		--output_mode=compiled \
		--compiler_jar=${CLOSURE_UTIL_DIR}/compiler.jar \
		--jvm_flags="${JVM_ARCH}" \
		--compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
		--compiler_flags="--generate_exports" \
		--compiler_flags="--warning_level=verbose" \
		--compiler_flags="--define=goog.DEBUG=false" \
		--compiler_flags="--define=goog.LOCALE='${LOCALE}'" \
		--output_file=${JS_APP_COMPILLED}
}

deps() {
	${PYTHON_BIN} ${CLOSURE_BUILD_DIR}/depswriter.py \
		--root_with_prefix="${JS_APP_DIR} ${URL_APP}" \
		--output_file=${JS_APP_DEPS}
}

case $1 in
	build)
	    echo "Building deps"
	    deps

		echo "Compiling JS"
		compile
		;;

	compile)
		compile
		;;

	deps)
		deps
		;;

	*)
		echo "Usage: $0 [build|compile|deps]"
		exit 1
esac
