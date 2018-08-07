
#import "RNSennoInsoleManager.h"

@implementation RNSennoInsoleManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[AttitudeView alloc] init];
}

@end
  
