
#import "RNTSennoManager.h"

@implementation RNTSennoManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[AttitudeView alloc] init];
}

@end
  
